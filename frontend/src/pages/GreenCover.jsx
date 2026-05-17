import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSustainabilityData } from '../utils/api';
import { Leaf, TreePine, MapPin, Search, Filter } from 'lucide-react';

const GreenCover = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <button className="btn-primary flex items-center gap-2">
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
            className="glass-card overflow-hidden"
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
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Green Corridor Potential: <strong>High</strong></span>
              <button className="text-xs font-bold text-primary-600 hover:underline">Full Details</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GreenCover;
