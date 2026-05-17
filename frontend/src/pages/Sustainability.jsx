import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSustainabilityData } from '../utils/api';
import { BarChart3, PieChart, Activity, Info, TrendingUp, ChevronRight } from 'lucide-react';

const Sustainability = () => {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchSustainabilityData();
        setWards(data);
      } catch (error) {
        console.error("Error fetching sustainability data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const getScoreColor = (score) => {
    if (score > 75) return 'text-green-500';
    if (score > 50) return 'text-primary-500';
    if (score > 30) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score List */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                Ward-wise Sustainability Scores
              </h3>
              <div className="flex gap-4 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> High</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-primary-500" /> Good</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Low</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {wards.sort((a, b) => b.sustainability_score - a.sustainability_score).map((ward, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex items-center gap-6">
                  <div className="w-12 text-center text-slate-400 font-bold text-lg">#{i+1}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">{ward.name}</h4>
                    <p className="text-xs text-slate-500">Sustainability Index</p>
                  </div>
                  <div className="w-32 hidden md:block">
                    <div className="flex justify-between text-[10px] mb-1 text-slate-400">
                      <span>Tree: {ward.tree_cover}%</span>
                      <span>Risk: {ward.risk_score}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getScoreColor(ward.sustainability_score).replace('text-', 'bg-')}`}
                        style={{ width: `${ward.sustainability_score}%` }}
                      />
                    </div>
                  </div>
                  <div className={`w-16 text-right font-black text-xl ${getScoreColor(ward.sustainability_score)}`}>
                    {ward.sustainability_score}
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Side Analytics */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              City Environmental Pulse
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">+4.2% Growth</p>
                  <p className="text-xs text-slate-500">Avg tree cover increase in 2025</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">-12% Density</p>
                  <p className="text-xs text-slate-500">Rainfall deficit predicted for Q3</p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold uppercase tracking-wider dark:text-slate-300">AI Insight</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Wards in the eastern sector show a correlation between rapid urbanization and a 15-point drop in sustainability index. Urgent green corridor intervention recommended.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sustainability;
