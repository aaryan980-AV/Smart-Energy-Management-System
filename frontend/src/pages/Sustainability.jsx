import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSustainabilityData, fetchCarbonEmissions } from '../utils/api';
import { 
  BarChart3, 
  PieChart, 
  Activity, 
  Info, 
  TrendingUp, 
  ChevronRight, 
  X, 
  Sparkles, 
  Wind, 
  Recycle, 
  Globe 
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Sustainability = () => {
  const [wards, setWards] = useState([]);
  const [carbonData, setCarbonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const [sustainabilityData, emissionsData] = await Promise.all([
          fetchSustainabilityData(),
          fetchCarbonEmissions()
        ]);
        setWards(sustainabilityData);
        setCarbonData(emissionsData);
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

  const emissionsChartData = carbonData ? {
    labels: carbonData.labels,
    datasets: [
      {
        label: 'Actual Emissions (kt)',
        data: carbonData.datasets[0].data,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Target Emissions (kt)',
        data: carbonData.datasets[1].data,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
  } : null;

  const emissionsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { family: 'Outfit' }
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
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
                <div 
                  key={i} 
                  onClick={() => setSelectedWard(ward)}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors flex items-center gap-6 cursor-pointer"
                >
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
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                  <Wind className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold dark:text-white">92 AQI</p>
                  <p className="text-xs text-slate-500">City-wide Average Air Quality (Moderate)</p>
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

      {/* Carbon Emissions Tracker */}
      {emissionsChartData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 h-[400px]"
        >
          <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary-500" />
            Carbon Emissions Tracker (Jan - Jun)
          </h3>
          <div className="h-[300px]">
            <Line data={emissionsChartData} options={emissionsOptions} />
          </div>
        </motion.div>
      )}

      {/* Interactive Ward Details Modal */}
      <AnimatePresence>
        {selectedWard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  {selectedWard.name} Deep Dive
                </h2>
                <button 
                  onClick={() => setSelectedWard(null)} 
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                    <Wind className="w-5 h-5 mx-auto mb-2 text-sky-500" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold">AQI</p>
                    <p className="text-lg font-bold mt-1 dark:text-white">{selectedWard.aqi || 88}</p>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      (selectedWard.aqi || 88) > 100 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                    }`}>
                      {(selectedWard.aqi || 88) > 150 ? 'Unhealthy' : (selectedWard.aqi || 88) > 100 ? 'Moderate' : 'Good'}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                    <Recycle className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Recycle Rate</p>
                    <p className="text-lg font-bold mt-1 dark:text-white">{selectedWard.recycling_rate || 54}%</p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                      Active
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                    <Globe className="w-5 h-5 mx-auto mb-2 text-amber-500" />
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Carbon Cap</p>
                    <p className="text-lg font-bold mt-1 dark:text-white">{selectedWard.carbon_footprint || 3.4} t</p>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                      Per Capita
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Ward Analytics Summary</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {selectedWard.name} has a sustainability score of <strong className={getScoreColor(selectedWard.sustainability_score)}>{selectedWard.sustainability_score}</strong>. 
                    {(selectedWard.aqi || 88) > 100 ? (
                      ` The high AQI of ${selectedWard.aqi} requires urgent emissions inspection.`
                    ) : (
                      ' Air quality remains stable, matching the residential green standards.'
                    )}
                    {selectedWard.tree_cover < 15 ? (
                      ` Tree canopy is critically low (${selectedWard.tree_cover}%), indicating high localized surface heating risks.`
                    ) : (
                      ` Tree canopy cover is healthy at ${selectedWard.tree_cover}%.`
                    )}
                  </p>
                </div>

                <button 
                  onClick={() => {
                    alert(`Intervention program initiated for ${selectedWard.name}!`);
                    setSelectedWard(null);
                  }}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40"
                >
                  Initiate Local Intervention
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sustainability;
