import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Settings, Search, Plus } from 'lucide-react';
import { getAllMaintenanceRequests } from '../api/maintenance.api';

export default function Maintenance({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Maintenance');
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['Maintenance', 'Dashboard', 'Maintenance Calendar', 'Equipment', 'Reporting', 'Teams'];

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      try {
        const data = await getAllMaintenanceRequests();
        setMaintenanceData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch maintenance requests');
        setLoading(false);
      }
    };

    fetchMaintenanceRequests();
  }, []);

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user ? user.name ? user.name.charAt(0).toUpperCase() : 'U' : 'U'}
              </div>
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
                  if (tab === 'Dashboard') {
                    navigate('/dashboard');
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

        {/* Maintenance Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Maintenance Requests</h2>
          </div>
          <div className="overflow-x-auto">
            {loading && <p className="p-6 text-center">Loading...</p>}
            {error && <p className="p-6 text-center text-red-400">{error}</p>}
            {!loading && !error && (
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Created By</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {maintenanceData.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">{item.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.createdBy?.firstName} {item.createdBy?.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.technician?.firstName} {item.technician?.lastName}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'New' ? 'bg-yellow-500/20 text-yellow-300' :
                          item.status === 'In Progress' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.company}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
