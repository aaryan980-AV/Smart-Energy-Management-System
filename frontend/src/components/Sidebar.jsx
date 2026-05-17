import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Thermometer, 
  Zap, 
  Leaf, 
  BarChart3, 
  ShieldAlert, 
  Settings,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen, darkMode, setDarkMode }) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Heat Risk Analysis', icon: Thermometer, path: '/heat-risk' },
    { name: 'Energy Analytics', icon: Zap, path: '/energy' },
    { name: 'Green Cover', icon: Leaf, path: '/green-cover' },
    { name: 'Sustainability', icon: BarChart3, path: '/sustainability' },
    { name: 'Admin Insights', icon: ShieldAlert, path: '/admin' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 glass-sidebar z-50 transition-transform duration-300 transform
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Thermometer className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight dark:text-white">HeatShield <span className="text-primary-600">AI</span></h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pune Smart City</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <NavLink to="/settings" className="nav-link">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
