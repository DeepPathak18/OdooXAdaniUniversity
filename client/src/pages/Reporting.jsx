import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench, Download, Filter,
  TrendingUp, CheckCircle, Clock,
  BarChart3, PieChart, LineChart, FileText,
  ChevronDown, X
} from 'lucide-react';
import MainNavigation from '../components/common/MainNavigation';
import { fetchDashboardData, fetchMaintenanceTrends } from '../api/analytics.api';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


export default function Reporting({ user, onLogout }) {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('last30days');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true); // Set to true initially to load data on mount
  const [error, setError] = useState(null);

  // Mock data - replace with API calls
  const tabs = ['Maintenance', 'Dashboard', 'Maintenance Calendar', 'Equipment', 'Reporting', 'Teams'];
  const [reportData, setReportData] = useState({
    totalRequests: 0,
    completedRequests: 0,
    inProgressRequests: 0,
    pendingRequests: 0,
    averageResponseTime: 0,
    averageCompletionTime: 0,
    criticalIssues: 0,
    equipmentHealth: 0,
    responseTimeBreakdown: { average: 0, fastest: 0, slowest: 0 },
    completionStats: { average: 0, completionRate: 0, onTimeCompletion: 0 },
    priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
    recentActivity: {
      thisWeek: { completed: 0, inProgress: 0, vsLastWeek: '0%' },
      thisMonth: { completed: 0, inProgress: 0, vsLastMonth: '0%' },
      equipmentStatus: { healthy: 0, criticalIssues: 0, vsLastMonth: '0%' },
    },
  });

  const [statusData, setStatusData] = useState({
    labels: ['Completed', 'In Progress', 'Pending', 'Scrapped'],
    datasets: [{ label: 'Requests', data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }],
  });

  const [categoryData, setCategoryData] = useState({
    labels: [],
    datasets: [{ label: 'Requests', data: [], backgroundColor: [], borderColor: [], borderWidth: 2 }],
  });

  const [monthlyTrendData, setMonthlyTrendData] = useState({
    labels: [],
    datasets: [],
  });

  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: [],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#94a3b8',
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
      },
    },
  };

  const handleExport = (format) => {
    toast.info(`Exporting report as ${format}...`);
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // TODO: Fetch data based on date range
    console.log('Fetching data for range:', range);
  };

  useEffect(() => {
    const getReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const dashboardResponse = await fetchDashboardData();
        setReportData(dashboardResponse);

        const trendsResponse = await fetchMaintenanceTrends(dateRange, categoryFilter);
        if (trendsResponse.monthlyTrendData) setMonthlyTrendData(trendsResponse.monthlyTrendData);
        if (trendsResponse.statusData) setStatusData(trendsResponse.statusData);
        if (trendsResponse.categoryData) setCategoryData(trendsResponse.categoryData);
        if (trendsResponse.performanceData) setPerformanceData(trendsResponse.performanceData);

      } catch (err) {
        console.error('Failed to fetch report data:', err);
        setError(err);
        toast.error('Failed to load report data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    getReportData();
  }, [dateRange, categoryFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 mb-4"></div>
          <p className="text-xl">Loading Report Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Error loading data.</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* Main Navigation */}
      <MainNavigation user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all pr-10"
              >
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="last90days">Last 90 Days</option>
                <option value="lastYear">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showFilters 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('PDF')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExport('Excel')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="Computers">Computers</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Network">Network</option>
                    <option value="Office Equipment">Office Equipment</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            {categoryFilter !== 'all' && (
              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-cyan-500" />
              <span className="text-2xl font-bold text-white">{reportData.totalRequests}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Total Requests</h3>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl font-bold text-white">{reportData.completedRequests}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Completed</h3>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">{reportData.averageResponseTime}h</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Avg Response Time</h3>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <span className="text-2xl font-bold text-white">{reportData.equipmentHealth}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-400">Equipment Health</h3>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trend Chart */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <LineChart className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Monthly Trend</h2>
              </div>
            </div>
            <div className="h-80">
              <Line data={monthlyTrendData} options={chartOptions} />
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Status Distribution</h2>
              </div>
            </div>
            <div className="h-80">
              <Pie data={statusData} options={pieOptions} />
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Requests by Category</h2>
              </div>
            </div>
            <div className="h-80">
              <Bar data={categoryData} options={chartOptions} />
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Performance Metrics</h2>
              </div>
            </div>
            <div className="h-80">
              <Bar data={performanceData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Response Time Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Response</span>
                <span className="text-white font-semibold">{reportData.responseTimeBreakdown.average} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Fastest Response</span>
                <span className="text-green-400 font-semibold">{reportData.responseTimeBreakdown.fastest} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Slowest Response</span>
                <span className="text-red-400 font-semibold">{reportData.responseTimeBreakdown.slowest} hours</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Completion Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Completion</span>
                <span className="text-white font-semibold">{reportData.completionStats.average} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completion Rate</span>
                <span className="text-green-400 font-semibold">{reportData.completionStats.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">On-Time Completion</span>
                <span className="text-blue-400 font-semibold">{reportData.completionStats.onTimeCompletion}%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Priority Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Critical</span>
                <span className="text-red-400 font-semibold">{reportData.priorityDistribution.critical} ({((reportData.priorityDistribution.critical / reportData.totalRequests) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">High</span>
                <span className="text-orange-400 font-semibold">{reportData.priorityDistribution.high} ({((reportData.priorityDistribution.high / reportData.totalRequests) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Medium</span>
                <span className="text-yellow-400 font-semibold">{reportData.priorityDistribution.medium} ({((reportData.priorityDistribution.medium / reportData.totalRequests) * 100).toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Low</span>
                <span className="text-green-400 font-semibold">{reportData.priorityDistribution.low} ({((reportData.priorityDistribution.low / reportData.totalRequests) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Recent Activity Summary</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">This Week</p>
                  <p className="text-gray-400 text-sm">{reportData.recentActivity.thisWeek.completed} requests completed, {reportData.recentActivity.thisWeek.inProgress} in progress</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-semibold">{reportData.recentActivity.thisWeek.vsLastWeek}</p>
                  <p className="text-gray-400 text-sm">vs last week</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">This Month</p>
                  <p className="text-gray-400 text-sm">{reportData.recentActivity.thisMonth.completed} requests completed, {reportData.recentActivity.thisMonth.inProgress} in progress</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-semibold">{reportData.recentActivity.thisMonth.vsLastMonth}</p>
                  <p className="text-gray-400 text-sm">vs last month</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Equipment Status</p>
                  <p className="text-gray-400 text-sm">{reportData.recentActivity.equipmentStatus.healthy}% healthy, {reportData.recentActivity.equipmentStatus.criticalIssues} critical issues</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{reportData.recentActivity.equipmentStatus.vsLastMonth}</p>
                  <p className="text-gray-400 text-sm">vs last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
