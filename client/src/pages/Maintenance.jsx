import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Settings, Search, Plus, Filter, ChevronDown, 
  Calendar, Clock, AlertTriangle, FileText, CheckCircle, 
  X, Eye, Edit, Trash2
} from 'lucide-react';

export default function Maintenance({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Maintenance');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const tabs = ['Maintenance', 'Dashboard', 'Maintenance Calendar', 'Equipment', 'Reporting', 'Teams'];

  // Mock data - will be replaced with API calls
  const maintenanceData = [
    { 
      id: 1, 
      subject: 'Test activity', 
      employee: 'Mitchell Admin', 
      technician: 'Aka Foster', 
      category: 'Computers', 
      stage: 'New Request', 
      company: 'My Company',
      priority: 'High',
      type: 'Corrective',
      requestDate: '12/18/2025',
      scheduledDate: '12/28/2025',
      equipment: 'Acer Laptop/LP/203/19281928'
    },
    { 
      id: 2, 
      subject: 'HVAC System Check', 
      employee: 'Sarah Johnson', 
      technician: 'Mike Wilson', 
      category: 'HVAC', 
      stage: 'In Progress', 
      company: 'My Company',
      priority: 'Medium',
      type: 'Preventive',
      requestDate: '12/15/2025',
      scheduledDate: '12/25/2025',
      equipment: 'HVAC Unit 01'
    },
    { 
      id: 3, 
      subject: 'Electrical Panel Inspection', 
      employee: 'John Davis', 
      technician: 'Emily Brown', 
      category: 'Electrical', 
      stage: 'Repaired', 
      company: 'My Company',
      priority: 'High',
      type: 'Corrective',
      requestDate: '12/10/2025',
      scheduledDate: '12/20/2025',
      equipment: 'Main Panel A'
    },
    { 
      id: 4, 
      subject: 'Server Room Cooling', 
      employee: 'Alex Martinez', 
      technician: 'David Lee', 
      category: 'HVAC', 
      stage: 'New Request', 
      company: 'My Company',
      priority: 'High',
      type: 'Corrective',
      requestDate: '12/19/2025',
      scheduledDate: '12/29/2025',
      equipment: 'AC Unit Server Room'
    },
    { 
      id: 5, 
      subject: 'Network Switch Maintenance', 
      employee: 'Lisa Chen', 
      technician: 'Aka Foster', 
      category: 'Network', 
      stage: 'In Progress', 
      company: 'My Company',
      priority: 'Low',
      type: 'Preventive',
      requestDate: '12/17/2025',
      scheduledDate: '12/27/2025',
      equipment: 'Switch 48-Port'
    },
    { 
      id: 6, 
      subject: 'Printer Troubleshooting', 
      employee: 'Robert Taylor', 
      technician: 'Mike Wilson', 
      category: 'Office Equipment', 
      stage: 'Scrap', 
      company: 'My Company',
      priority: 'Low',
      type: 'Corrective',
      requestDate: '12/05/2025',
      scheduledDate: '12/15/2025',
      equipment: 'HP LaserJet Pro'
    },
  ];

  // Filter data based on search and filters
  const filteredData = maintenanceData.filter(item => {
    const matchesSearch = item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.stage === statusFilter;
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Calculate stats
  const stats = {
    total: maintenanceData.length,
    newRequests: maintenanceData.filter(item => item.stage === 'New Request').length,
    inProgress: maintenanceData.filter(item => item.stage === 'In Progress').length,
    completed: maintenanceData.filter(item => item.stage === 'Repaired').length,
    highPriority: maintenanceData.filter(item => item.priority === 'High').length,
  };

  const getStatusColor = (stage) => {
    switch(stage) {
      case 'New Request': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'In Progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Repaired': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Scrap': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const handleViewRequest = (id) => {
    // Navigate to detail view or open modal
    console.log('View request:', id);
  };

  const handleEditRequest = (id) => {
    // Navigate to edit view or open modal
    console.log('Edit request:', id);
  };

  const handleDeleteRequest = (id) => {
    // Handle delete
    console.log('Delete request:', id);
  };

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
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <button 
            onClick={() => navigate('/maintenance/new')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>New Request</span>
          </button>

          <div className="flex items-center space-x-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by subject, employee, technician, or equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
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
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New Request">New Request</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Repaired">Repaired</option>
                    <option value="Scrap">Scrap</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {(statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all') && (
              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setPriorityFilter('all');
                  }}
                  className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-cyan-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">New Requests</p>
                <p className="text-2xl font-bold text-white">{stats.newRequests}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">In Progress</p>
                <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-green-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Completed</p>
                <p className="text-2xl font-bold text-white">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">High Priority</p>
                <p className="text-2xl font-bold text-white">{stats.highPriority}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Maintenance Requests Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Maintenance Requests</h2>
            <span className="text-sm text-gray-400">{filteredData.length} request(s) found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Technician</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-8 text-center text-gray-400">
                      No maintenance requests found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{item.subject}</div>
                        <div className="text-xs text-gray-400">{item.company}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.equipment}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.employee}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{item.technician}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs border border-cyan-500/30">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(item.stage)}`}>
                          {item.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{item.requestDate}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewRequest(item.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-cyan-400 hover:text-cyan-300"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditRequest(item.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(item.id)}
                            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}