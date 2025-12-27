<<<<<<< HEAD
const MaintenanceRequest = require('../models/MaintenanceRequest');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');
=======
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Wrench, Users, Calendar, FileText, Search, Plus, TrendingUp, Clock, CheckCircle, ChevronDown, Monitor, Loader, AlertTriangle, RefreshCw } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import MainNavigation from '../components/common/MainNavigation';
>>>>>>> ca2b29ddb15985bdf6c3f31234fa87d5eafb0d6a

/* ======================================================
   GET CALENDAR EVENTS
====================================================== */
const getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query;

    let filter = { scheduledDate: { $exists: true, $ne: null } };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      filter.scheduledDate = { $gte: startDate, $lt: endDate };
    }

    const events = await MaintenanceRequest.find(filter)
      .populate('createdBy', 'firstName lastName')
      .populate('equipment', 'name')
      .populate('team', 'teamName')
      .populate('technician', 'firstName lastName')
      .sort({ scheduledDate: 1 });

    const formattedEvents = events.map(event => ({
      id: event._id,
      subject: event.subject,
      date: event.scheduledDate,
      day: event.scheduledDate.getDate(),
      month: event.scheduledDate.getMonth(),
      year: event.scheduledDate.getFullYear(),
      time: event.scheduledDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: event.status || 'scheduled',
      priority: event.priority,
      category: event.category,
      maintenanceType: event.maintenanceType,
      equipment: event.equipment?.name || 'Unknown Equipment',
      technician: event.technician
        ? `${event.technician.firstName} ${event.technician.lastName}`
        : 'Unassigned',
      team: event.team?.teamName || 'Unknown Team',
      durationHours: event.durationHours,
      notes: event.notes
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/* ======================================================
   DASHBOARD DATA
====================================================== */
const getDashboardData = async (req, res) => {
  try {
    const totalRequests = await MaintenanceRequest.countDocuments();
    const completedRequests = await MaintenanceRequest.countDocuments({ status: 'Repaired' });
    const inProgressRequests = await MaintenanceRequest.countDocuments({ status: 'In Progress' });
    const pendingRequests = await MaintenanceRequest.countDocuments({ status: 'New' });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const overdueRequests = await MaintenanceRequest.countDocuments({
      status: { $nin: ['Repaired', 'Scrap'] },
      scheduledDate: { $lt: now, $exists: true }
    });

    const completedToday = await MaintenanceRequest.countDocuments({
      status: 'Repaired',
      updatedAt: { $gte: today }
    });

    const underRepairEquipment = inProgressRequests;

    const activeTechnicians = await MaintenanceRequest.distinct('technician', {
      status: 'In Progress'
    });
    const allTechnicians = await MaintenanceRequest.distinct('technician');
    const totalTechnicians = allTechnicians.filter(id => id).length;
    const technicianUtilization = totalTechnicians > 0 ? Math.round((activeTechnicians.filter(id => id).length / totalTechnicians) * 100) : 0;

    const avgResponseTime = 2.4; // Placeholder

    const totalEquipment = await Equipment.countDocuments();
    const scrappedEquipment = await Equipment.countDocuments({ status: 'Scrapped' });
    const equipmentHealth = totalEquipment > 0 ? Math.round(((totalEquipment - scrappedEquipment) / totalEquipment) * 100) : 100;

    const priorityAgg = await MaintenanceRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const priorityDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
    priorityAgg.forEach(p => {
      if (p._id) priorityDistribution[p._id.toLowerCase()] = p.count;
    });

    const recentRequests = await MaintenanceRequest.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('equipment', 'name')
      .populate('technician', 'firstName lastName');

    const upcomingMaintenance = await MaintenanceRequest.find({
      scheduledDate: { $gte: now, $lte: next7Days }
    })
      .sort({ scheduledDate: 1 })
      .populate('equipment', 'name')
      .populate('technician', 'firstName lastName');

    // Add trends data
    const monthlyTrendData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Completed',
          data: [completedRequests, completedRequests, completedRequests, completedRequests, completedRequests, completedRequests],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
        {
          label: 'In Progress',
          data: [inProgressRequests, inProgressRequests, inProgressRequests, inProgressRequests, inProgressRequests, inProgressRequests],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Pending',
          data: [pendingRequests, pendingRequests, pendingRequests, pendingRequests, pendingRequests, pendingRequests],
          borderColor: 'rgb(234, 179, 8)',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          tension: 0.4,
        },
      ],
    };

    const statusData = {
      labels: ['Completed', 'In Progress', 'Pending', 'Scrap'],
      datasets: [
        {
          label: 'Requests',
          data: [completedRequests, inProgressRequests, pendingRequests, scrappedEquipment],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(234, 179, 8)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
        },
      ],
    };

    res.status(200).json({
      statistics: {
        underRepairEquipment,
        technicianUtilization,
        pendingRequests,
        overdueRequests,
        completedToday,
        avgResponseTime,
        activeTechnicians: activeTechnicians.filter(id => id).length,
        totalTechnicians,
        equipmentHealth
      },
      recentRequests: recentRequests.map(req => ({
        _id: req._id,
        subject: req.subject,
        equipment: req.equipment,
        technician: req.technician,
        priority: req.priority,
        status: req.status,
        createdAt: req.createdAt
      })),
      upcomingMaintenance: upcomingMaintenance.map(req => ({
        _id: req._id,
        subject: req.subject,
        equipment: req.equipment,
        technician: req.technician,
        scheduledDate: req.scheduledDate
      })),
      trends: {
        monthlyTrendData,
        statusData
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/* ======================================================
   MAINTENANCE TRENDS (MOCK DATA)
====================================================== */
const getMaintenanceTrends = async (req, res) => {
  try {
    res.status(200).json({
      monthlyTrendData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Completed', data: [12, 15, 18, 14, 16, 20] },
          { label: 'In Progress', data: [5, 7, 6, 8, 9, 7] },
          { label: 'Pending', data: [3, 2, 4, 3, 5, 4] }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/* ======================================================
   CREATE SAMPLE EVENTS
====================================================== */
const createSampleEvents = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
    }

    let equipment = await Equipment.findOne();
    if (!equipment) {
      equipment = await Equipment.create({
        name: 'Sample Equipment',
        category: 'General',
        serialNumber: 'TEST-001'
      });
    }

    let team = await MaintenanceTeam.findOne();
    if (!team) {
      team = await MaintenanceTeam.create({
        teamName: 'Sample Team',
        teamMembers: [user._id]
      });
    }

    const events = await MaintenanceRequest.insertMany([
      {
        subject: 'HVAC Maintenance',
        createdBy: user._id,
        equipment: equipment._id,
        team: team._id,
        technician: user._id,
        scheduledDate: new Date(),
        priority: 'Medium',
        status: 'In Progress'
      }
    ]);

    res.status(201).json({ message: 'Sample events created', events });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

<<<<<<< HEAD
/* ======================================================
   EXPORTS
====================================================== */
module.exports = {
  getCalendarEvents,
  getDashboardData,
  getMaintenanceTrends,
  createSampleEvents
};
=======
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/maintenance/new')}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>New Request</span>
            </button>
            <button
              onClick={async () => {
                setRefreshing(true);
                await fetchDashboardData(false);
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>

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

        {/* Charts Section */}
        {dashboardData?.trends && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Trends Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Maintenance Trends</h3>
              </div>
              <div className="h-64">
                <Line
                  data={dashboardData.trends.monthlyTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#e2e8f0'
                        }
                      }
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: '#94a3b8'
                        },
                        grid: {
                          color: '#334155'
                        }
                      },
                      y: {
                        ticks: {
                          color: '#94a3b8'
                        },
                        grid: {
                          color: '#334155'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Status Distribution Chart */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Request Status Distribution</h3>
              </div>
              <div className="h-64">
                <Pie
                  data={dashboardData.trends.statusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: {
                          color: '#e2e8f0'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
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
                          {item.status === 'In Progress' ? 'In Progress' : item.status || 'New'}
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
>>>>>>> ca2b29ddb15985bdf6c3f31234fa87d5eafb0d6a
