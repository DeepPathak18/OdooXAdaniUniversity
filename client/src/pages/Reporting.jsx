import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Settings, Download, Filter, 
  TrendingUp, CheckCircle, Clock, 
  BarChart3, PieChart, LineChart, FileText, 
  ChevronDown, X
} from 'lucide-react';
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
import { Line, Bar, Pie } from 'react-chartjs-2';
import { toast } from 'react-toastify';

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
  const [activeTab, setActiveTab] = useState('Reporting');
  const [dateRange, setDateRange] = useState('last30days');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const tabs = ['Maintenance', 'Dashboard', 'Maintenance Calendar', 'Equipment', 'Reporting', 'Teams'];

  // Mock data - replace with API calls
  const [reportData, setReportData] = useState({
    totalRequests: 156,
    completedRequests: 128,
    inProgressRequests: 18,
    pendingRequests: 10,
    averageResponseTime: 2.4,
    averageCompletionTime: 5.2,
    criticalIssues: 5,
    equipmentHealth: 87
  });

  // Maintenance requests by status
  const statusData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Scrapped'],
    datasets: [
      {
        label: 'Requests',
        data: [128, 18, 10, 5],
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

  // Requests by category
  const categoryData = {
    labels: ['Computers', 'HVAC', 'Electrical', 'Network', 'Office Equipment'],
    datasets: [
      {
        label: 'Requests',
        data: [45, 32, 28, 25, 26],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Monthly trend
  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Completed',
        data: [12, 15, 18, 14, 16, 20, 22, 19, 21, 18, 16, 14],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'In Progress',
        data: [5, 7, 6, 8, 9, 7, 8, 6, 7, 5, 4, 3],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Pending',
        data: [3, 2, 4, 3, 5, 4, 3, 2, 3, 4, 5, 6],
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Performance metrics
  const performanceData = {
    labels: ['Response Time (h)', 'Resolution Time (h)', 'First Contact (h)', 'SLA Compliance (%)'],
    datasets: [
      {
        label: 'Current Month',
        data: [2.4, 5.2, 1.8, 92],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Last Month',
        data: [2.8, 5.8, 2.1, 88],
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 2,
      },
    ],
  };

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
    // TODO: Fetch report data from API
    // fetchReportData(dateRange, categoryFilter);
  }, [dateRange, categoryFilter]);

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
                  if (tab === 'Dashboard') {
                    navigate('/dashboard');
                  } else if (tab === 'Maintenance') {
                    navigate('/maintenance');
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
                <span className="text-white font-semibold">2.4 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Fastest Response</span>
                <span className="text-green-400 font-semibold">0.5 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Slowest Response</span>
                <span className="text-red-400 font-semibold">8.2 hours</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Completion Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Completion</span>
                <span className="text-white font-semibold">5.2 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completion Rate</span>
                <span className="text-green-400 font-semibold">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">On-Time Completion</span>
                <span className="text-blue-400 font-semibold">92%</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Priority Distribution</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Critical</span>
                <span className="text-red-400 font-semibold">5 (3%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">High</span>
                <span className="text-orange-400 font-semibold">32 (21%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Medium</span>
                <span className="text-yellow-400 font-semibold">89 (57%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Low</span>
                <span className="text-green-400 font-semibold">30 (19%)</span>
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
                  <p className="text-gray-400 text-sm">45 requests completed, 12 in progress</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-semibold">+15%</p>
                  <p className="text-gray-400 text-sm">vs last week</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">This Month</p>
                  <p className="text-gray-400 text-sm">156 requests completed, 18 in progress</p>
                </div>
                <div className="text-right">
                  <p className="text-cyan-400 font-semibold">+8%</p>
                  <p className="text-gray-400 text-sm">vs last month</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">Equipment Status</p>
                  <p className="text-gray-400 text-sm">87% healthy, 5 critical issues</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">+2%</p>
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
