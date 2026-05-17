import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSustainabilityData } from '../utils/api';
import { Leaf, TreePine, MapPin, Search, Filter, X, Sparkles, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const GreenCover = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const handleViewDetails = (ward) => {
    setSelectedWard(ward);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchSustainabilityData();
        setWards(data);
      } catch (error) {
        console.error("Error fetching green cover data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (showMap) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 500);
    }
  }, [showMap]);

  const getPriorityColor = (risk) => {
    if (risk === 'High') return 'text-red-500 bg-red-500/10';
    if (risk === 'Medium') return 'text-orange-500 bg-orange-500/10';
    return 'text-green-500 bg-green-500/10';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tree Plantation Recommendation</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Priority wards identified by AI for urban greening.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowMap(true)}
            className="btn-primary flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <MapPin className="w-4 h-4" />
            View Planting Sites
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wards.sort((a, b) => a.tree_cover - b.tree_cover).slice(0, 6).map((ward, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5 }}
            className="glass-card overflow-hidden flex flex-col"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{ward.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ward ID: #PN-{(i+101)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getPriorityColor(ward.risk_category)}`}>
                  {ward.risk_category} Priority
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Current Tree Cover</span>
                    <span className="font-bold dark:text-white">{ward.tree_cover}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${ward.tree_cover}%` }}
                      className="bg-green-500 h-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Suggested Saplings</p>
                    <p className="text-lg font-bold text-primary-600">{(ward.population / 100).toFixed(0)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Cooling Potential</p>
                    <p className="text-lg font-bold text-primary-600">-{((100 - ward.tree_cover) / 20).toFixed(1)}°C</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 mt-auto bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Green Corridor Potential: <strong className="text-green-600 dark:text-green-400">High</strong></span>
              <button 
                onClick={() => handleViewDetails(ward)}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
              >
                Full Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {/* Map Modal */}
        {showMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  City-Wide Planting Sites
                </h2>
                <button 
                  onClick={() => setShowMap(false)} 
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-2 h-[500px] bg-slate-50 dark:bg-slate-800/50 relative z-10">
                <MapContainer 
                  center={[18.5204, 73.8567]} 
                  zoom={12} 
                  style={{ height: '100%', width: '100%', zIndex: 1 }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {wards.map((ward, i) => (
                    <Marker
                      key={i}
                      position={[ward.lat, ward.lng]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">{ward.name}</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between gap-4">
                              <span>Tree Cover:</span>
                              <strong>{ward.tree_cover}%</strong>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span>Saplings Target:</span>
                              <strong>{(ward.population / 100).toFixed(0)}</strong>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span>Priority:</span>
                              <strong className={ward.risk_category === 'High' ? 'text-red-500' : 'text-orange-500'}>{ward.risk_category}</strong>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setShowMap(false);
                              handleViewDetails(ward);
                            }}
                            className="mt-3 w-full text-xs font-bold bg-primary-600 text-white py-1.5 rounded"
                          >
                            View Action Plan
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </motion.div>
          </div>
        )}

        {/* Ward Details Modal */}
        {selectedWard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  {selectedWard.name} Action Plan
                </h2>
                <button 
                  onClick={() => setSelectedWard(null)} 
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none"><Sparkles className="w-16 h-16 text-primary-500" /></div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2 relative z-10">
                    <Sparkles className="w-4 h-4 text-primary-500" />
                    Action Plan Summary
                  </h4>
                  <div className="relative z-10 text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[100px] flex flex-col justify-center">
                    <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed">
                      Based on ward data, planting <strong className="text-primary-600 dark:text-primary-400">{(selectedWard.population / 100).toFixed(0)}</strong> saplings in <span className="font-bold">{selectedWard.name}</span> will reduce local surface temperatures by up to <strong className="text-primary-600 dark:text-primary-400">{((100 - selectedWard.tree_cover) / 20).toFixed(1)}°C</strong> over 5 years.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    alert(`Action plan for ${selectedWard.name} has been successfully approved and queued for the Forestry Department.`);
                    setSelectedWard(null);
                  }}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Approve Ward Action Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GreenCover;
