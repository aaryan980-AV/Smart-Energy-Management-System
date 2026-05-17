import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchHeatRiskData } from '../utils/api';
import { motion } from 'framer-motion';
import { AlertTriangle, Thermometer, Users, TreePine } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HeatRiskMap = () => {
  const [wardData, setWardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchHeatRiskData();
        setWardData(data);
      } catch (error) {
        console.error("Error fetching heat risk data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
    
    // Trigger resize to fix Leaflet map container issues
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }, []);

  const getColor = (risk) => {
    if (risk === 'High') return '#ef4444';
    if (risk === 'Medium') return '#f59e0b';
    return '#10b981';
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Risk Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">High Risk Wards</span>
                <span className="font-bold text-red-500">{wardData.filter(w => w.risk_category === 'High').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Medium Risk Wards</span>
                <span className="font-bold text-orange-500">{wardData.filter(w => w.risk_category === 'Medium').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Low Risk Wards</span>
                <span className="font-bold text-green-500">{wardData.filter(w => w.risk_category === 'Low').length}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Legend</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <span className="text-sm dark:text-slate-300">High Risk (&gt;0.7)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-sm dark:text-slate-300">Medium Risk (0.4-0.7)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span className="text-sm dark:text-slate-300">Low Risk (&lt;0.4)</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 glass-card p-2 h-[600px] relative z-10"
        >
          <MapContainer 
            center={[18.5204, 73.8567]} 
            zoom={12} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {wardData.map((ward, i) => (
              <CircleMarker
                key={i}
                center={[ward.lat, ward.lng]}
                radius={20}
                pathOptions={{ 
                  fillColor: getColor(ward.risk_category), 
                  color: 'white', 
                  weight: 2, 
                  fillOpacity: 0.7 
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <h4 className="font-bold text-slate-900 border-b pb-1 mb-2">{ward.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span>Temp: <strong>{ward.avg_temp}°C</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Pop: <strong>{ward.population.toLocaleString()}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-green-500" />
                        <span>Tree Cover: <strong>{ward.tree_cover}%</strong></span>
                      </div>
                      <div className="mt-2 pt-2 border-t font-bold text-center">
                        Risk Score: <span className={ward.risk_category === 'High' ? 'text-red-500' : 'text-orange-500'}>{ward.risk_score}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default HeatRiskMap;
