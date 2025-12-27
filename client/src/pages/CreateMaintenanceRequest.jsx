import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, ChevronDown, Calendar, Clock, 
  Save, Send, X, ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function CreateMaintenanceRequest({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    equipment: '',
    category: '',
    maintenanceType: 'Corrective',
    team: '',
    technician: '',
    scheduledDate: '',
    durationHours: '',
    priority: 'Medium',
    company: '',
    status: 'New',
    notes: '',
    instructions: ''
  });

  const [activeTab, setActiveTab] = useState('Notes');
  const [equipmentList, setEquipmentList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [technicianList, setTechnicianList] = useState([]);

  // Fetch equipment, teams, and technicians
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token not found. Please log in.');
      navigate('/login');
      return;
    }

    const fetchEquipmentList = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/equipment', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch equipment list');
        }
        const data = await response.json();
        setEquipmentList(data);
      } catch (error) {
        toast.error(error.message || 'Error fetching equipment');
        console.error('Error fetching equipment:', error);
      }
    };

    const fetchTeamList = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teams', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch team list');
        }
        const data = await response.json();
        setTeamList(data);
      } catch (error) {
        toast.error(error.message || 'Error fetching teams');
        console.error('Error fetching teams:', error);
      }
    };

    const fetchTechnicianList = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/usernames', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch usernames list');
        }
        const data = await response.json();
        setTechnicianList(data);
      } catch (error) {
        toast.error(error.message || 'Error fetching usernames');
        console.error('Error fetching usernames:', error);
      }
    };
    
    fetchEquipmentList();
    fetchTeamList();
    fetchTechnicianList();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e, saveAsDraft = false) => {
    e.preventDefault();
    
    // Validation
    if (!formData.subject.trim()) {
      toast.error('Subject is required');
      return;
    }
    if (!formData.equipment) {
      toast.error('Equipment is required');
      return;
    }
    if (!formData.category.trim()) {
      toast.error('Category is required');
      return;
    }
    if (!formData.team) {
      toast.error('Team is required');
      return;
    }
    if (!formData.company.trim()) {
      toast.error('Company is required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const requestData = {
        ...formData,
        durationHours: formData.durationHours ? parseFloat(formData.durationHours) : 0,
        scheduledDate: formData.scheduledDate || undefined,
        technician: formData.technician || undefined,
        status: saveAsDraft ? 'New' : formData.status
      };

      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create maintenance request');
      }

      // const result = await response.json();
      toast.success(saveAsDraft ? 'Request saved as draft' : 'Maintenance request created successfully');
      navigate('/maintenance');
    } catch (error) {
      toast.error(error.message || 'Failed to create maintenance request');
      console.error('Error creating request:', error);
    } finally {
      setLoading(false);
    }
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
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  GearGuard
                </h1>
                <p className="text-sm text-gray-400">Create Maintenance Request</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/maintenance')}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-cyan-400 transition-all cursor-pointer"
                title="View Profile"
              >
                {user ? (user.username ? user.username.charAt(0).toUpperCase() : user.firstName?.charAt(0).toUpperCase() || 'U') : 'U'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Top Action Bar */}
      <div className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/maintenance')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Maintenance Requests</span>
              <span>/</span>
              <span className="text-white">New Request</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <main className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Subject */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xl font-semibold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="Enter maintenance request subject"
                  />
                </div>

                {/* Equipment & Category */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Equipment <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      >
                        <option value="">Select Equipment</option>
                        {equipmentList.map((eq) => (
                          <option key={eq._id} value={eq._id}>
                            {eq.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      placeholder="e.g., Computers, HVAC, Electrical"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Request Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        name="requestDate"
                        value={formData.requestDate}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Maintenance Type */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-4">
                    Maintenance Type <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.maintenanceType === 'Corrective'
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-slate-600 group-hover:border-slate-500'
                      }`}>
                        {formData.maintenanceType === 'Corrective' && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="maintenanceType"
                        value="Corrective"
                        checked={formData.maintenanceType === 'Corrective'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className="text-white">Corrective</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.maintenanceType === 'Preventive'
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-slate-600 group-hover:border-slate-500'
                      }`}>
                        {formData.maintenanceType === 'Preventive' && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="maintenanceType"
                        value="Preventive"
                        checked={formData.maintenanceType === 'Preventive'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <span className="text-white">Preventive</span>
                    </label>
                  </div>
                </div>

                {/* Company */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Company <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    placeholder="e.g., My Company (San Francisco)"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Team & Technician */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Team <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="team"
                        value={formData.team}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      >
                        <option value="">Select Team</option>
                        {teamList.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.teamName}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Technician
                    </label>
                    <div className="relative">
                      <select
                        name="technician"
                        value={formData.technician}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      >
                        <option value="">Select Technician (Optional)</option>
                        {technicianList.map((tech) => (
                          <option key={tech._id} value={tech._id}>
                            {tech.username}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Schedule & Duration */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Scheduled Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="datetime-local"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Duration (Hours)
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        name="durationHours"
                        value={formData.durationHours}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        className="w-full pl-11 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                        placeholder="0.0"
                      />
                    </div>
                  </div>
                </div>

                {/* Priority */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-4">
                    Priority <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Status */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Repaired">Repaired</option>
                      <option value="Scrap">Scrap</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Instructions Section */}
            <div className="mt-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
              <div className="flex border-b border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab('Notes')}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === 'Notes'
                      ? 'bg-slate-700 text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Notes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('Instructions')}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === 'Instructions'
                      ? 'bg-slate-700 text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Instructions
                </button>
              </div>
              <div className="p-6">
                <textarea
                  name={activeTab === 'Notes' ? 'notes' : 'instructions'}
                  value={activeTab === 'Notes' ? formData.notes : formData.instructions}
                  onChange={handleInputChange}
                  placeholder={activeTab === 'Notes' ? 'Add maintenance notes...' : 'Add maintenance instructions...'}
                  rows={8}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/maintenance')}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={loading}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : 'Save Draft'}</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
