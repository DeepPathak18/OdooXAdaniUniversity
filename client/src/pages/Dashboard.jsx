import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wrench, Users, Calendar, FileText, Settings, Search, Plus, TrendingUp, Clock, CheckCircle, ChevronDown, Monitor } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = ['Maintenance', 'Dashboard', 'Maintenance Calendar', 'Reporting'];
  const [showEquipmentDropdown, setShowEquipmentDropdown] = useState(false);

  const maintenanceData = [
    { id: 1, subject: 'Test activity', employee: 'Mitchell Admin', technician: 'Aka Foster', category: 'computer', stage: 'New Request', company: 'My company' },
    { id: 2, subject: 'HVAC System Check', employee: 'Sarah Johnson', technician: 'Mike Wilson', category: 'hvac', stage: 'In Progress', company: 'My company' },
    { id: 3, subject: 'Electrical Panel Inspection', employee: 'John Davis', technician: 'Emily Brown', category: 'electrical', stage: 'Completed', company: 'My company' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
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
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-cyan-400 transition-all cursor-pointer"
                title="View Profile"
              >
                {user ? (user.name ? user.name.charAt(0).toUpperCase() : user.firstName?.charAt(0).toUpperCase() || 'U') : 'U'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-700">
        <div className="px-6">
          <div className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'Maintenance') {
                    navigate('/maintenance');
                  } else if (tab === 'Maintenance Calendar') {
                    navigate('/maintenance-calendar');
                  } else if (tab === 'Reporting') {
                    navigate('/reporting');
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`px-4 py-3 font-medium transition-all ${
                  activeTab === tab
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
            
              {/* Teams Tab */}
              <button
                onClick={() => navigate('/teams')}
                className={`px-4 py-3 font-medium transition-all flex items-center space-x-1 text-gray-400 hover:text-cyan-300`}
              >
                <Users className="w-4 h-4" />
                <span>Teams</span>
              </button>
            
              {/* Equipment Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowEquipmentDropdown(!showEquipmentDropdown)}
                  className={`px-4 py-3 font-medium transition-all flex items-center space-x-1 text-gray-400 hover:text-cyan-300`}
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
                      className="w-full px-6 py-3 text-left text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-all flex items-center space-x-2 first:rounded-t-lg"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Work Center</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/equipment');
                        setShowEquipmentDropdown(false);
                      }}
                      className="w-full px-6 py-3 text-left text-gray-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-all flex items-center space-x-2 last:rounded-b-lg"
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

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30">
            <Plus className="w-5 h-5" />
            <span>New</span>
          </button>

          <div className="relative flex-1 max-w-md ml-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Critical Equipment Card */}
          <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 backdrop-blur-sm border border-red-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-red-500/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full">
                URGENT
              </span>
            </div>
            <h3 className="text-lg font-semibold text-red-300 mb-2">Critical Equipment</h3>
            <div className="text-3xl font-bold text-white mb-1">5 Units</div>
            <p className="text-sm text-red-300">(Health &lt; 30%)</p>
          </div>

          {/* Technician Load Card */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">
                MONITOR
              </span>
            </div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Technician Load</h3>
            <div className="text-3xl font-bold text-white mb-1">85% Utilized</div>
            <p className="text-sm text-blue-300">(Assign Carefully)</p>
          </div>

          {/* Open Requests Card */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 backdrop-blur-sm border border-green-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <FileText className="w-8 h-8 text-green-400" />
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full">
                ACTIVE
              </span>
            </div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">Open Requests</h3>
            <div className="flex items-baseline space-x-3 mb-1">
              <span className="text-3xl font-bold text-white">12</span>
              <span className="text-lg text-green-300">Pending</span>
            </div>
            <p className="text-sm text-red-300">3 Overdue</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Completed Today</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">2.4h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Technicians</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Equipment Health</p>
                <p className="text-2xl font-bold text-white">87%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-cyan-500" />
            </div>
          </div>
        </div>

        {/* Maintenance Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Recent Maintenance Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {maintenanceData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">{item.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{item.employee}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{item.technician}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.stage === 'New Request' ? 'bg-yellow-500/20 text-yellow-300' :
                        item.stage === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {item.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{item.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}