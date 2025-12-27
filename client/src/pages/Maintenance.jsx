import React, { useState } from 'react';
import { Wrench, Settings, ChevronDown, Calendar, Clock, AlertTriangle, FileText, Save, Send, X } from 'lucide-react';

export default function MaintenanceRequestForm({ user, onLogout }) {
  const [maintenanceType, setMaintenanceType] = useState('Corrective');
  const [activeTab, setActiveTab] = useState('Notes');
  const [priority, setPriority] = useState(2);

  const statusStages = ['New Request', 'In Progress', 'Repaired', 'Scrap'];
  const [currentStage, setCurrentStage] = useState(0);

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
                <p className="text-sm text-gray-400">Maintenance Requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                MA
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top Action Bar */}
      <div className="bg-slate-900/30 backdrop-blur-sm border-b border-slate-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30">
              <span>New</span>
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Maintenance Requests</span>
              <span>/</span>
              <span className="text-white">Test activity</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Worksheet</span>
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Progress Bar */}
      <div className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl">
          {statusStages.map((stage, index) => (
            <div key={stage} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  index <= currentStage
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-slate-700 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  index <= currentStage ? 'text-cyan-400' : 'text-gray-500'
                }`}>
                  {stage}
                </span>
              </div>
              {index < statusStages.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  index < currentStage ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <main className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Subject */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject?</label>
                <input
                  type="text"
                  value="Test activity"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-xl font-semibold focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              {/* Created By & Maintenance For */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Created By</label>
                  <input
                    type="text"
                    value="Mitchell Admin"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Maintenance For</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all">
                      <option>Equipment</option>
                      <option>Facility</option>
                      <option>Vehicle</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Equipment Details */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Equipment</label>
                  <div className="relative">
                    <input
                      type="text"
                      value="Acer Laptop/LP/203/19281928"
                      className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all pr-10"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <input
                    type="text"
                    value="Computers"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Request Date?</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value="12/18/2025"
                      className="w-full pl-11 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Maintenance Type */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-4">Maintenance Type</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      maintenanceType === 'Corrective'
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-slate-600 group-hover:border-slate-500'
                    }`}>
                      {maintenanceType === 'Corrective' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-white">Corrective</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      maintenanceType === 'Preventive'
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-slate-600 group-hover:border-slate-500'
                    }`}>
                      {maintenanceType === 'Preventive' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-white">Preventive</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Team & Technician */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Team</label>
                  <input
                    type="text"
                    value="Internal Maintenance"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Technician</label>
                  <input
                    type="text"
                    value="Aka Foster"
                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Schedule & Duration */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Scheduled Date?</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value="12/28/2025 14:30:00"
                      className="w-full pl-11 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value="00:00 hours"
                      className="w-full pl-11 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-4">Priority</label>
                <div className="flex items-center space-x-3">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setPriority(level)}
                      className={`w-16 h-16 rounded-lg transition-all ${
                        priority === level
                          ? 'bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50 scale-110'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className={`w-8 h-8 ${priority === level ? 'bg-white/30' : 'bg-slate-600'} transform rotate-45 rounded-sm`} />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Company */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                <input
                  type="text"
                  value="My Company (San Francisco)"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Notes & Instructions Section */}
          <div className="mt-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            <div className="flex border-b border-slate-700">
              <button
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
                placeholder={activeTab === 'Notes' ? 'Add maintenance notes...' : 'Add maintenance instructions...'}
                rows={8}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end space-x-4">
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all">
              Cancel
            </button>
            <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all flex items-center space-x-2">
              <Save className="w-5 h-5" />
              <span>Save Draft</span>
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Submit Request</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}