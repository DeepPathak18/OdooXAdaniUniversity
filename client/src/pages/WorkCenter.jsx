import React, { useState, useEffect } from 'react';
import { Wrench, Settings, Plus, Edit2, Trash2, Search, Filter, Download, Upload, Save, X } from 'lucide-react';
import { getAllWorkCenters, createWorkCenter, updateWorkCenter, deleteWorkCenter } from '../api/workcenter.api';
import { toast } from 'react-toastify';

export default function WorkCenterView({ user, onLogout }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newWorkCenter, setNewWorkCenter] = useState({
    name: '',
    code: '',
    tag: '',
    alternativeWorkcenter: '',
    costPerHour: '',
    capacity: '',
    timeEfficiency: '',
    oeeTarget: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch work centers on component mount
  useEffect(() => {
    fetchWorkCenters();
  }, []);

  const fetchWorkCenters = async () => {
    try {
      setLoading(true);
      const data = await getAllWorkCenters();
      setWorkCenters(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch work centers');
      toast.error('Failed to fetch work centers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkCenter = async () => {
    // Validate required fields
    if (!newWorkCenter.name || !newWorkCenter.code) {
      toast.error('Please fill in required fields (Name and Code)');
      return;
    }

    try {
      const workCenterData = {
        name: newWorkCenter.name,
        code: newWorkCenter.code,
        tag: newWorkCenter.tag || '',
        alternativeWorkcenter: newWorkCenter.alternativeWorkcenter || '',
        costPerHour: parseFloat(newWorkCenter.costPerHour) || 0,
        capacity: parseFloat(newWorkCenter.capacity) || 100,
        timeEfficiency: parseFloat(newWorkCenter.timeEfficiency) || 100,
        oeeTarget: parseFloat(newWorkCenter.oeeTarget) || 85,
        company: 'My Company (San Francisco)' // Default company, can be made dynamic
      };

      if (isEditing && editingId) {
        await updateWorkCenter(editingId, workCenterData);
        toast.success('Work center updated successfully');
      } else {
        await createWorkCenter(workCenterData);
        toast.success('Work center created successfully');
      }
      
      resetNewWorkCenter();
      fetchWorkCenters(); // Refresh list
    } catch (err) {
      const errorMessage = err.response?.data?.message || (isEditing ? 'Failed to update work center' : 'Failed to create work center');
      toast.error(errorMessage);
      console.error('Error saving work center:', err);
    }
  };

  const resetNewWorkCenter = () => {
    setNewWorkCenter({
      name: '',
      code: '',
      tag: '',
      alternativeWorkcenter: '',
      costPerHour: '',
      capacity: '',
      timeEfficiency: '',
      oeeTarget: ''
    });
    setEditingId(null);
    setIsEditing(false);
    setShowAddModal(false);
  };

  const handleDeleteWorkCenter = async (id) => {
    const wc = workCenters.find(w => (w.id === id || w._id === id));
    if (!wc) return;
    if (window.confirm(`Delete work center "${wc.name}"? This action cannot be undone.`)) {
      try {
        await deleteWorkCenter(id || wc._id);
        toast.success('Work center deleted successfully');
        fetchWorkCenters(); // Refresh list
      } catch (err) {
        toast.error('Failed to delete work center');
        console.error('Error deleting work center:', err);
      }
    }
  };

  const openEditModal = (wc) => {
    setNewWorkCenter({
      name: wc.name || '',
      code: wc.code || '',
      tag: wc.tag || '',
      alternativeWorkcenter: wc.alternativeWorkcenter || '',
      costPerHour: wc.costPerHour != null ? wc.costPerHour : '',
      capacity: wc.capacity != null ? wc.capacity : '',
      timeEfficiency: wc.timeEfficiency != null ? wc.timeEfficiency : '',
      oeeTarget: wc.oeeTarget != null ? wc.oeeTarget : '',
    });
    setEditingId(wc.id || wc._id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const filteredWorkCenters = workCenters.filter(wc => {
    const searchLower = searchTerm.toLowerCase();
    const name = (wc.name || '').toLowerCase();
    const code = (wc.code || '').toLowerCase();
    const tag = (wc.tag || '').toLowerCase();
    
    return name.includes(searchLower) ||
           code.includes(searchLower) ||
           tag.includes(searchLower);
  });

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
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  GearGuard
                </h1>
                <p className="text-sm text-gray-400">Work Center Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user ? user.firstName?.charAt(0).toUpperCase() || 'U' : 'U'}
                </div>
              </div>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Title & Instructions */}
      <div className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-white mb-2">Work Center List View</h2>
        <p className="text-sm text-cyan-400">
          Manage work centers and configure their properties for maintenance scheduling and equipment allocation.
        </p>
      </div>

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="max-w-full">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add Work Center</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all">
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
              
              <button className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search work centers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all w-64"
                />
              </div>
              
              <button className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Work Center Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            {loading && <div className="p-6 text-center text-gray-400">Loading work centers...</div>}
            {error && <div className="p-6 text-center text-red-400">{error}</div>}
            {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Work Center
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Tag
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Alternative Workcenters
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Cost per hour
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Time Efficiency
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      OEE Target
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredWorkCenters.map((workCenter) => (
                    <tr key={workCenter.id || workCenter._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {workCenter.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {workCenter.code}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium">
                          {workCenter.tag}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {workCenter.alternativeWorkcenter}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        ${(workCenter.costPerHour || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {(workCenter.capacity || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {(workCenter.timeEfficiency || 0).toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          (workCenter.oeeTarget || 0) >= 85 ? 'bg-green-500/20 text-green-300' :
                          (workCenter.oeeTarget || 0) >= 70 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {(workCenter.oeeTarget || 0).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <button onClick={() => openEditModal(workCenter)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteWorkCenter(workCenter.id || workCenter._id)}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredWorkCenters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">No work centers found</p>
              </div>
            )}
          </div>

          {/* Statistics Footer */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Work Centers</p>
              <p className="text-2xl font-bold text-white">{workCenters.length}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Avg Cost per Hour</p>
              <p className="text-2xl font-bold text-white">
                ${workCenters.length > 0 ? (workCenters.reduce((acc, wc) => acc + (wc.costPerHour || 0), 0) / workCenters.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Avg Time Efficiency</p>
              <p className="text-2xl font-bold text-white">
                {workCenters.length > 0 ? (workCenters.reduce((acc, wc) => acc + (wc.timeEfficiency || 0), 0) / workCenters.length).toFixed(2) : '0.00'}%
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Avg OEE Target</p>
              <p className="text-2xl font-bold text-white">
                {workCenters.length > 0 ? (workCenters.reduce((acc, wc) => acc + (wc.oeeTarget || 0), 0) / workCenters.length).toFixed(2) : '0.00'}%
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Add Work Center Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{isEditing ? 'Edit Work Center' : 'Add New Work Center'}</h3>
              <button 
                onClick={() => resetNewWorkCenter()}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Work Center Name *</label>
                  <input
                    type="text"
                    value={newWorkCenter.name}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, name: e.target.value})}
                    placeholder="e.g., Assembly 1"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Code *</label>
                  <input
                    type="text"
                    value={newWorkCenter.code}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, code: e.target.value})}
                    placeholder="e.g., ASM-001"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tag</label>
                  <input
                    type="text"
                    value={newWorkCenter.tag}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, tag: e.target.value})}
                    placeholder="e.g., Production"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Alternative Workcenter</label>
                  <input
                    type="text"
                    value={newWorkCenter.alternativeWorkcenter}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, alternativeWorkcenter: e.target.value})}
                    placeholder="e.g., Drill 1"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Cost per Hour</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkCenter.costPerHour}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, costPerHour: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Capacity</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkCenter.capacity}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, capacity: e.target.value})}
                    placeholder="100.00"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Time Efficiency (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkCenter.timeEfficiency}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, timeEfficiency: e.target.value})}
                    placeholder="100.00"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">OEE Target (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkCenter.oeeTarget}
                    onChange={(e) => setNewWorkCenter({...newWorkCenter, oeeTarget: e.target.value})}
                    placeholder="85.00"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end space-x-4">
                <button 
                  onClick={() => resetNewWorkCenter()}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddWorkCenter}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{isEditing ? 'Save Changes' : 'Save Work Center'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}