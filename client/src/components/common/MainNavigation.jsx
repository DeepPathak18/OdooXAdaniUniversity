import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Users, Calendar, FileText, Monitor, ChevronDown, LogOut } from 'lucide-react';

const MainNavigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);

  // Define navigation items
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: null },
    { name: 'Maintenance', path: '/maintenance', icon: null },
    { name: 'Maintenance Calendar', path: '/maintenance-calendar', icon: Calendar },
    { name: 'Reporting', path: '/reporting', icon: FileText },
    { name: 'Teams', path: '/teams', icon: Users },
  ];

  // Get current active tab based on pathname
  const getActiveTab = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/maintenance') return 'Maintenance';
    if (location.pathname === '/maintenance-calendar') return 'Maintenance Calendar';
    if (location.pathname === '/reporting') return 'Reporting';
    if (location.pathname === '/teams') return 'Teams';
    if (location.pathname === '/equipment') return 'Equipment';
    if (location.pathname === '/workcenter') return 'Work Center';
    return 'Dashboard'; // default
  };

  const activeTab = getActiveTab();

  return (
    <>
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                GearGuard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-cyan-400 transition-all cursor-pointer"
                title="View Profile"
              >
                {user ? (user.name ? user.name.charAt(0).toUpperCase() : user.firstName?.charAt(0).toUpperCase() || 'U') : 'U'}
              </button>
              <button
                onClick={onLogout}
                className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-red-400 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-700">
        <div className="px-6">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`px-4 py-3 font-medium transition-all flex items-center space-x-1 ${
                  activeTab === item.name
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </button>
            ))}

            {/* Equipment Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowEquipmentDropdown(!showEquipmentDropdown)}
                className={`px-4 py-3 font-medium transition-all flex items-center space-x-1 ${
                  activeTab === 'Equipment' || activeTab === 'Work Center'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Equipment</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showEquipmentDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showEquipmentDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  <button
                    onClick={() => {
                      navigate('/workcenter');
                      setShowEquipmentDropdown(false);
                    }}
                    className={`w-full px-6 py-3 text-left transition-all flex items-center space-x-2 first:rounded-t-lg ${
                      activeTab === 'Work Center'
                        ? 'text-cyan-400 bg-slate-700/50'
                        : 'text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Work Center</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/equipment');
                      setShowEquipmentDropdown(false);
                    }}
                    className={`w-full px-6 py-3 text-left transition-all flex items-center space-x-2 last:rounded-b-lg ${
                      activeTab === 'Equipment'
                        ? 'text-cyan-400 bg-slate-700/50'
                        : 'text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Equipment List</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainNavigation;