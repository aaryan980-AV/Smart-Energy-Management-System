import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import HeatRiskMap from './pages/HeatRiskMap';
import EnergyAnalytics from './pages/EnergyAnalytics';
import GreenCover from './pages/GreenCover';
import Sustainability from './pages/Sustainability';
import AdminInsights from './pages/AdminInsights';
import { Menu, Bell, User, Search } from 'lucide-react';

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getPageTitle = () => {
    const path = location.pathname;
    switch(path) {
      case '/': return 'City Overview';
      case '/heat-risk': return 'Heat Risk Analysis';
      case '/energy': return 'Energy Demand Analytics';
      case '/green-cover': return 'Urban Green Cover';
      case '/sustainability': return 'Sustainability Indicators';
      case '/admin': return 'Smart City Admin Insights';
      default: return 'HeatShield AI';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass-sidebar lg:bg-transparent lg:backdrop-blur-none border-b lg:border-none px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="w-6 h-6 dark:text-white" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white hidden sm:block">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search ward data..." 
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-64 transition-all"
              />
            </div>
            <button className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-3 ml-3 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold dark:text-white leading-none">Admin User</p>
                <p className="text-xs text-slate-500 mt-1">Pune Smart City</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 p-0.5 shadow-lg shadow-primary-500/20">
                <div className="w-full h-full rounded-[10px] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/heat-risk" element={<HeatRiskMap />} />
            <Route path="/energy" element={<EnergyAnalytics />} />
            <Route path="/green-cover" element={<GreenCover />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/admin" element={<AdminInsights />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
