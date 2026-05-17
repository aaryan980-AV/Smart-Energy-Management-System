import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { fetchEnergyForecast } from '../utils/api';
import { Zap, TrendingUp, Clock, Calendar } from 'lucide-react';

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

const EnergyAnalytics = () => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchEnergyForecast();
        setForecastData(data);
      } catch (error) {
        console.error("Error fetching energy forecast:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const chartData = {
    labels: forecastData.map((d, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Energy Demand (MW)',
        data: forecastData.map(d => d.demand),
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Avg Temperature (°C)',
        data: forecastData.map(d => d.temp),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        yAxisID: 'y1',
        tension: 0.4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Outfit' }
        }
      },
    },
    scales: {
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-6 h-[450px]"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Energy vs Temperature Correlation
            </h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-semibold bg-primary-600 text-white rounded-md">7 Days</button>
              <button className="px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">30 Days</button>
            </div>
          </div>
          <div className="h-[320px]">
            <Line data={chartData} options={options} />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Peak Demand Insights
            </h3>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Estimated Peak Hour</p>
                <p className="text-xl font-bold dark:text-white mt-1">2:30 PM - 4:00 PM</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                <p className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider">Cooling Load Ratio</p>
                <p className="text-xl font-bold dark:text-white mt-1">64% of Total Demand</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              AI Forecast Summary
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Based on the upcoming heatwave alert for next Tuesday, energy demand is expected to surge by <span className="text-red-500 font-bold">12.5%</span>. Recommended grid load balancing active for central wards.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EnergyAnalytics;
