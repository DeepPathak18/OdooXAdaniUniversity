
import React, { useState, useEffect } from 'react';
import { Wrench, Settings, Plus, Edit2, Trash2, Search, Filter, Download, Upload, Monitor, Laptop } from 'lucide-react';
import { getAllEquipment, createEquipment, updateEquipment, deleteEquipment } from '../api/equipment.api';
import { toast } from 'react-toastify';
import MainNavigation from '../components/common/MainNavigation';

export default function EquipmentListView({ user, onLogout }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch equipment on component mount
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await getAllEquipment();
      setEquipmentList(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch equipment');
      toast.error('Failed to fetch equipment');
    } finally {
      setLoading(false);
    }
  };

  const [newEquipment, setNewEquipment] = useState({
    equipmentName: '',
    employee: '',
    department: '',
    serialNumber: '',
    technician: '',
    equipmentCategory: 'Monitors',
    company: 'My Company (San Francisco)'
  });

  const handleDeleteEquipment = async (id) => {
    const eq = equipmentList.find(e => (e.id === id || e._id === id));
    if (!eq) return;
    if (window.confirm(`Delete equipment "${eq.equipmentName || eq.name}"? This cannot be undone.`)) {
      try {
        await deleteEquipment(id || eq._id);
        toast.success('Equipment deleted successfully');
        fetchEquipment(); // Refresh list
      } catch (err) {
        toast.error('Failed to delete equipment');
        console.error('Error deleting equipment:', err);
      }
    }
  };

  const resetNewEquipment = () => {
    setNewEquipment({
      equipmentName: '',
      employee: '',
      department: '',
      serialNumber: '',
      technician: '',
      equipmentCategory: 'Monitors',
      company: 'My Company (San Francisco)'
    });
    setIsEditing(false);
    setEditingId(null);
    setShowAddModal(false);
  };

  const openEditModal = (eq) => {
    setNewEquipment({
      equipmentName: eq.name || "",
      employee: eq.employee || "",
      department: eq.department || "",
      serialNumber: eq.serialNumber || "",
      technician: eq.technicianName || "",
      equipmentCategory: eq.category || "Monitors",
      company: eq.company || "My Company (San Francisco)",
    });
    setEditingId(eq.id || eq._id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleSaveEquipment = async () => {
    if (!newEquipment.equipmentName || !newEquipment.serialNumber) {
      toast.error('Please fill in required fields (Equipment Name and Serial Number)');
      return;
    }

    try {
      const equipmentData = {
        equipmentName: newEquipment.equipmentName,
        equipmentCategory: newEquipment.equipmentCategory,
        serialNumber: newEquipment.serialNumber,
        employee: newEquipment.employee,
        department: newEquipment.department,
        technicianName: newEquipment.technician,
        company: newEquipment.company,
        usedByType: 'Employee',
        status: 'Active'
      };

      if (isEditing && editingId) {
        await updateEquipment(editingId, equipmentData);
        toast.success('Equipment updated successfully');
      } else {
        await createEquipment(equipmentData);
        toast.success('Equipment created successfully');
      }
      
      resetNewEquipment();
      fetchEquipment(); // Refresh list
    } catch (err) {
      toast.error(isEditing ? 'Failed to update equipment' : 'Failed to create equipment');
      console.error('Error saving equipment:', err);
    }
  };

  const filteredEquipment = equipmentList.filter(eq => {
    const searchLower = searchTerm.toLowerCase();
    const name = (eq.equipmentName || eq.name || '').toLowerCase();
    const employee = (eq.employee || '').toLowerCase();
    const serial = (eq.serialNumber || '').toLowerCase();
    const category = (eq.equipmentCategory || eq.category || '').toLowerCase();
    
    return name.includes(searchLower) ||
           employee.includes(searchLower) ||
           serial.includes(searchLower) ||
           category.includes(searchLower);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">
      {/* Main Navigation */}
      <MainNavigation user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="px-6 py-6">
        <div className="max-w-full">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => { resetNewEquipment(); setShowAddModal(true); }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>New</span>
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
                  placeholder="Search..."
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

          {/* Equipment Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">
              <Monitor className="w-6 h-6 text-cyan-400" />
              <span>Equipment</span>
            </h2>
          </div>

          {/* Equipment Table */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            {loading && <div className="p-6 text-center text-gray-400">Loading equipment...</div>}
            {error && <div className="p-6 text-center text-red-400">{error}</div>}
            {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Equipment Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Serial Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Technician
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Equipment Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredEquipment.map((equipment) => (
                    <tr key={equipment.id || equipment._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            (equipment.equipmentCategory || equipment.category) === 'Monitors' 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                              : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          }`}>
                            {(equipment.equipmentCategory || equipment.category) === 'Monitors' ? (
                              <Monitor className="w-5 h-5 text-white" />
                            ) : (
                              <Laptop className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <span className="text-white font-medium">{equipment.equipmentName || equipment.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {equipment.employee}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                          {equipment.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                        {equipment.serialNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {equipment.technician}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium">
                          {equipment.equipmentCategory || equipment.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {equipment.company}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openEditModal(equipment)}
                            className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEquipment(equipment.id || equipment._id)}
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
            {!loading && !error && filteredEquipment.length === 0 && (
              <div className="text-center py-12">
                <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No equipment found</p>
                <p className="text-gray-500 text-sm mt-2">Add your first equipment to get started</p>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Equipment</p>
                  <p className="text-2xl font-bold text-white">{equipmentList.length}</p>
                </div>
                <Monitor className="w-8 h-8 text-cyan-500" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Monitors</p>
                  <p className="text-2xl font-bold text-white">
                    {equipmentList.filter(eq => eq.equipmentCategory === 'Monitors').length}
                  </p>
                </div>
                <Monitor className="w-8 h-8 text-purple-500" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Computers</p>
                  <p className="text-2xl font-bold text-white">
                    {equipmentList.filter(eq => eq.equipmentCategory === 'Computers').length}
                  </p>
                </div>
                <Laptop className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Active Technicians</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(equipmentList.map(eq => eq.technician)).size}
                  </p>
                </div>
                <Wrench className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add/Edit Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Monitor className="w-6 h-6 text-cyan-400" />
                  <span>{isEditing ? 'Edit Equipment' : 'Add Equipment'}</span>
                </h3>
                <button 
                  onClick={() => resetNewEquipment()}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-2xl text-gray-400 hover:text-white">×</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Equipment Name</label>
                  <input
                    type="text"
                    value={newEquipment.equipmentName}
                    onChange={(e) => setNewEquipment({...newEquipment, equipmentName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Employee</label>
                  <input
                    type="text"
                    value={newEquipment.employee}
                    onChange={(e) => setNewEquipment({...newEquipment, employee: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Department</label>
                  <input
                    type="text"
                    value={newEquipment.department}
                    onChange={(e) => setNewEquipment({...newEquipment, department: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Serial Number</label>
                  <input
                    type="text"
                    value={newEquipment.serialNumber}
                    onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Technician</label>
                  <input
                    type="text"
                    value={newEquipment.technician}
                    onChange={(e) => setNewEquipment({...newEquipment, technician: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={newEquipment.equipmentCategory}
                    onChange={(e) => setNewEquipment({...newEquipment, equipmentCategory: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  >
                    <option value="Monitors">Monitors</option>
                    <option value="Computers">Computers</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    value={newEquipment.company}
                    onChange={(e) => setNewEquipment({...newEquipment, company: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <button 
                  onClick={() => resetNewEquipment()}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSaveEquipment()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"
                >
                  {isEditing ? 'Save Changes' : 'Save Equipment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}