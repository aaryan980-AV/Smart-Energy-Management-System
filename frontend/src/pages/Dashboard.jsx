import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Zap, 
  Leaf, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { fetchHeatRiskData } from '../utils/api';
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

const chartData = {
  labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  datasets: [
    {
      label: 'Avg Temperature (°C)',
      data: [28, 27, 26, 31, 35, 38, 33, 29],
      borderColor: 'rgb(249, 115, 22)',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.4,
      fill: true,
      yAxisID: 'y',
    },
    {
      label: 'Energy Demand (MW)',
      data: [1800, 1600, 1500, 2200, 2700, 2900, 2600, 2100],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      yAxisID: 'y1',
    }
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#94a3b8',
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#fff',
      bodyColor: '#cbd5e1',
      borderColor: 'rgba(51, 65, 85, 0.5)',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)',
        display: false
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: '#94a3b8'
      }
    },
  },
};

const StatCard = ({ title, value, icon: Icon, trend, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  const [wardData, setWardData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchHeatRiskData();
        // Sort by temperature (highest first)
        const sorted = data.sort((a, b) => b.avg_temp - a.avg_temp);
        setWardData(sorted);
      } catch (error) {
        console.error("Error fetching ward data:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Welcome */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Good Morning, Admin</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening in Pune city today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Avg. City Temp" 
          value="34.5°C" 
          icon={Thermometer} 
          trend={2.4} 
          color="orange"
          delay={0.1}
        />
        <StatCard 
          title="Energy Demand" 
          value="2,450 MW" 
          icon={Zap} 
          trend={5.2} 
          color="blue"
          delay={0.2}
        />
        <StatCard 
          title="Tree Cover" 
          value="18.2%" 
          icon={Leaf} 
          trend={-0.5} 
          color="green"
          delay={0.3}
        />
        <StatCard 
          title="Citizen Complaints" 
          value="128" 
          icon={AlertTriangle} 
          trend={-12} 
          color="red"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass-card p-6 h-[400px]">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">City-wide Temperature & Demand Trends</h3>
          <div className="h-[300px] w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Side Panel */}
        <div className="glass-card p-6 h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-800 dark:text-white mb-6">All City Temperatures</h3>
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
            {wardData.map((ward, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ward.risk_category === 'High' ? 'bg-red-500' : ward.risk_category === 'Medium' ? 'bg-orange-500' : 'bg-green-500'}`} />
                  <span className="font-medium dark:text-slate-200">{ward.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{ward.avg_temp}°C</span>
              </div>
            ))}
            {wardData.length === 0 && (
              <div className="text-center text-slate-500 py-4">Loading data...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
