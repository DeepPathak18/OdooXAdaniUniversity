import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wrench, Users, Calendar, FileText, Search, Plus, TrendingUp, Clock, CheckCircle, ChevronDown, Monitor, Loader, AlertTriangle } from 'lucide-react';
import MainNavigation from '../components/common/MainNavigation';

export default function Dashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch dashboard data from backend
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      // Use relative path so Vite dev server proxy handles the backend URL
      const response = await fetch('/api/analytics/dashboard-data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Authentication failed. Please log in again.');
          localStorage.removeItem('token');
          navigate('/signin');
          return;
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Filter recent requests based on search term
  const filteredRequests = dashboardData?.recentRequests?.filter(request =>
    request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.technician?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.technician?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Get status color for maintenance requests
  const getStatusColor = (status) => {
    const s = (status || '').toString().toLowerCase();
    if (s === 'repaired' || s === 'completed') return 'bg-green-500/20 text-green-300';
    if (s === 'in progress' || s === 'in-progress' || s === 'in_progress') return 'bg-blue-500/20 text-blue-300';
    if (s === 'new' || s === 'pending') return 'bg-yellow-500/20 text-yellow-300';
    if (s === 'scrap' || s === 'scrapped') return 'bg-gray-600/20 text-gray-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/20 text-red-300';
      case 'high':
        return 'bg-orange-500/20 text-orange-300';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'low':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
        <MainNavigation user={user} onLogout={onLogout} />
        <main className="px-6 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3 text-cyan-400">
              <Loader className="w-6 h-6 animate-spin" />
              <span>Loading dashboard data...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
        <MainNavigation user={user} onLogout={onLogout} />
        <main className="px-6 py-6">
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const stats = dashboardData?.statistics || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* Main Navigation */}
      <MainNavigation user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/maintenance/new')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>New Request</span>
          </button>

          <div className="relative flex-1 max-w-md ml-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search maintenance requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                CRITICAL
              </span>
            </div>
            <h3 className="text-lg font-semibold text-red-300 mb-2">Equipment Issues</h3>
            <div className="text-3xl font-bold text-white mb-1">{stats.underRepairEquipment || 0} Units</div>
            <p className="text-sm text-red-300">Under Repair</p>
          </div>

          {/* Technician Load Card */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-sm border border-blue-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
            <div className="flex items-start justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">
                UTILIZATION
              </span>
            </div>
            <h3 className="text-lg font-semibold text-blue-300 mb-2">Technician Load</h3>
            <div className="text-3xl font-bold text-white mb-1">{stats.technicianUtilization || 0}%</div>
            <p className="text-sm text-blue-300">Active Technicians: {stats.activeTechnicians || 0}</p>
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
              <span className="text-3xl font-bold text-white">{stats.pendingRequests || 0}</span>
              <span className="text-lg text-green-300">Pending</span>
            </div>
            <p className="text-sm text-red-300">{stats.overdueRequests || 0} Overdue</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Completed Today</p>
                <p className="text-2xl font-bold text-white">{stats.completedToday || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">{stats.avgResponseTime || 0}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Technicians</p>
                <p className="text-2xl font-bold text-white">{stats.totalTechnicians || 0}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Equipment Health</p>
                <p className="text-2xl font-bold text-white">{stats.equipmentHealth || 0}%</p>
              </div>
              <TrendingUp className={`w-8 h-8 ${stats.equipmentHealth >= 80 ? 'text-green-500' : stats.equipmentHealth >= 60 ? 'text-yellow-500' : 'text-red-500'}`} />
            </div>
          </div>
        </div>

        {/* Upcoming Maintenance Section */}
        {dashboardData?.upcomingMaintenance && dashboardData.upcomingMaintenance.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Upcoming Maintenance (Next 7 Days)</h2>
            </div>
            <div className="space-y-3">
              {dashboardData.upcomingMaintenance.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{item.subject}</p>
                      <p className="text-xs text-gray-400">
                        {item.equipment?.name} • {item.technician ? `${item.technician.firstName} ${item.technician.lastName}` : 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-cyan-400">
                      {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'No date'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.scheduledDate ? new Date(item.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Maintenance Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Recent Maintenance Requests</h2>
            <p className="text-sm text-gray-400 mt-1">
              Showing {filteredRequests.length} of {dashboardData?.recentRequests?.length || 0} requests
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => navigate(`/maintenance/${item._id}`)}>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.equipment?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {item.technician ? `${item.technician.firstName} ${item.technician.lastName}` : 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                          {item.status === 'in-progress' ? 'In Progress' : item.status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      {searchTerm ? 'No maintenance requests found matching your search.' : 'No maintenance requests found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}