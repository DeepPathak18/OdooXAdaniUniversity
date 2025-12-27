


import React, { useState, useEffect } from 'react';

import { Wrench, Settings, Plus, Edit2, Trash2, Search, Users, Building2, UserPlus, X, Save } from 'lucide-react';

import { getAllTeams, createTeam, updateTeam, deleteTeam } from '../api/team.api';

import { getAllUsers } from '../api/user.api';

import { toast } from 'react-toastify';

import MainNavigation from '../components/common/MainNavigation';



export default function TeamsManagement({ user, onLogout }) {

  const [showAddModal, setShowAddModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editingTeamId, setEditingTeamId] = useState(null);

  const [teams, setTeams] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);

  const [selectedUserId, setSelectedUserId] = useState('');



  const [newTeam, setNewTeam] = useState({

    teamName: '',

    teamMembers: [],

    company: 'My Company (San Francisco)'

  });



  const [searchTerm, setSearchTerm] = useState('');



  // Fetch teams and users on component mount

  useEffect(() => {

    fetchTeams();

    fetchUsers();

  }, []);



  const fetchTeams = async () => {

    try {

      setLoading(true);

      const data = await getAllTeams();

      setTeams(data);

      setError(null);

    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to fetch teams');

      toast.error('Failed to fetch teams');

    } finally {

      setLoading(false);

    }

  };



  const fetchUsers = async () => {

    try {

      const data = await getAllUsers();

      setUsers(data);

    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to fetch users');

    }

  };



  const handleAddTeam = async () => {

    // Validate required fields

    if (!newTeam.teamName) {

      toast.error('Please enter a team name');

      return;

    }

    if (!newTeam.teamMembers || newTeam.teamMembers.length === 0) {

      toast.error('Please add at least one team member');

      return;

    }



    try {

      const teamData = {

        teamName: newTeam.teamName,

        members: newTeam.teamMembers.map(m => m._id),

        company: newTeam.company,

        specialty: newTeam.specialty || ''

      };



      if (isEditing && editingTeamId) {

        await updateTeam(editingTeamId, teamData);

        toast.success('Team updated successfully');

      } else {

        await createTeam(teamData);

        toast.success('Team created successfully');

      }



      resetNewTeam();

      fetchTeams(); // Refresh list

    } catch (err) {

      const errorMessage = err.response?.data?.message || (isEditing ? 'Failed to update team' : 'Failed to create team');

      toast.error(errorMessage);

      console.error('Error saving team:', err);

    }

  };



  const resetNewTeam = () => {

    setNewTeam({

      teamName: '',

      teamMembers: [],

      company: 'My Company (San Francisco)',

      specialty: ''

    });

    setSelectedUserId('');

    setIsEditing(false);

    setEditingTeamId(null);

    setShowAddModal(false);

  };



  const handleAddMember = () => {

    if (selectedUserId) {

      const userToAdd = users.find(u => u._id === selectedUserId);

      if (userToAdd && !newTeam.teamMembers.find(m => m._id === userToAdd._id)) {

        setNewTeam({

          ...newTeam,

          teamMembers: [...newTeam.teamMembers, userToAdd]

        });

      }

      setSelectedUserId('');

    }

  };



  const handleRemoveMember = (userId) => {

    setNewTeam({

      ...newTeam,

      teamMembers: newTeam.teamMembers.filter((m) => m._id !== userId)

    });

  };



  const handleDeleteTeam = async (id) => {

    const team = teams.find(t => (t.id === id || t._id === id));

    if (!team) return;

    if (window.confirm(`Delete team "${team.teamName}"? This cannot be undone.`)) {

      try {

        await deleteTeam(id || team._id);

        toast.success('Team deleted successfully');

        fetchTeams(); // Refresh list

      } catch (err) {

        toast.error('Failed to delete team');

        console.error('Error deleting team:', err);

      }

    }

  };



  const openEditModal = (team) => {

    setNewTeam({

      teamName: team.teamName || '',

      teamMembers: team.members || [],

      company: team.company || 'My Company (San Francisco)',

      specialty: team.specialty || ''

    });

    setEditingTeamId(team.id || team._id);

    setIsEditing(true);

    setShowAddModal(true);

  };



  const filteredTeams = teams.filter(team => {

    const searchLower = searchTerm.toLowerCase();

    const teamName = (team.teamName || '').toLowerCase();

    const company = (team.company || '').toLowerCase();

    const members = (team.members || team.teamMembers || []).map(m => {
      if (!m) return '';
      if (typeof m === 'string') return m.toLowerCase();
      return (`${m.firstName || m.username || ''} ${m.lastName || ''}`).trim().toLowerCase();
    });



    return teamName.includes(searchLower) ||

      members.some(member => member.includes(searchLower)) ||

      company.includes(searchLower);

  });



  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100">

      {/* Main Navigation */}

      <MainNavigation user={user} onLogout={onLogout} />



      {/* Main Content */}

      <main className="px-6 py-6">

        <div className="max-w-7xl mx-auto">

          {/* Action Bar */}

          <div className="flex items-center justify-between mb-6">

            <button

              onClick={() => setShowAddModal(true)}

              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30"

            >

              <Plus className="w-5 h-5" />

              <span>New</span>

            </button>



            <div className="relative">

              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />

              <input

                type="text"

                placeholder="Search teams..."

                value={searchTerm}

                onChange={(e) => setSearchTerm(e.target.value)}

                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all w-64"

              />

            </div>

          </div>



          {/* Teams Title */}

          <div className="mb-6">

            <h2 className="text-2xl font-semibold text-white flex items-center space-x-2">

              <Users className="w-6 h-6 text-cyan-400" />

              <span>Teams</span>

            </h2>

          </div>



          {/* Teams Table */}

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">

            {loading && <div className="p-6 text-center text-gray-400">Loading teams...</div>}

            {error && <div className="p-6 text-center text-red-400">{error}</div>}

            {!loading && !error && (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-900/50 border-b border-slate-700">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">

                        Team Name

                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">

                        Team Members

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

                    {filteredTeams.map((team) => (

                  <tr key={team.id || team._id} className="hover:bg-slate-700/30 transition-colors">

                        <td className="px-6 py-4">

                          <div className="flex items-center space-x-3">

                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">

                              <Users className="w-5 h-5 text-white" />

                            </div>

                            <span className="text-white font-medium">{team.teamName}</span>

                          </div>

                        </td>

                        <td className="px-6 py-4">

                          <>
                            {(team.members || team.teamMembers || []).map((member, index) => {
                              // member may be a string (name) or an object (user)
                              const isString = typeof member === 'string';
                              const displayName = isString
                                ? member
                                : (member.firstName || member.username || '') + (member.lastName ? ` ${member.lastName}` : '');
                              const initial = isString
                                ? (member ? member.charAt(0).toUpperCase() : '?')
                                : (member.firstName ? member.firstName.charAt(0).toUpperCase() : (member.username ? member.username.charAt(0).toUpperCase() : '?'));
                              const key = isString ? `${displayName}-${index}` : (member._id || index);

                              return (
                                <span
                                  key={key}
                                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center space-x-2"
                                >
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                    {initial}
                                  </div>
                                  <span>{displayName || 'Unknown'}</span>
                                </span>
                              );
                            })}
                          </>

                      </td><td className="px-6 py-4">

                          <div className="flex items-center space-x-2 text-gray-300">

                            <Building2 className="w-4 h-4 text-cyan-400" />

                            <span>{team.company}</span>

                          </div>

                        </td><td className="px-6 py-4">

                          <div className="flex items-center space-x-2">

                            <button onClick={() => openEditModal(team)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all">

                              <Edit2 className="w-4 h-4" />

                            </button>

                            <button

                              onClick={() => handleDeleteTeam(team.id || team._id)}

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

          {!loading && !error && filteredTeams.length === 0 && (

            <div className="text-center py-12">

              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />

              <p className="text-gray-400 text-lg">No teams found</p>

              <p className="text-gray-500 text-sm mt-2">Create your first team to get started</p>

            </div>

          )}

        </div>



        {/* Statistics */}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-sm mb-1">Total Teams</p>

                <p className="text-2xl font-bold text-white">{teams ? teams.length : 0}</p>

              </div>

              <Users className="w-8 h-8 text-cyan-500" />

            </div>

          </div>



          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-sm mb-1">Total Members</p>

                <p className="text-2xl font-bold text-white">
                  {teams && teams.length > 0
                    ? teams.reduce((acc, team) => acc + (((team.members && Array.isArray(team.members)) ? team.members.length : (team.teamMembers && Array.isArray(team.teamMembers)) ? team.teamMembers.length : 0)), 0)
                    : 0}
                </p>

              </div>

              <UserPlus className="w-8 h-8 text-blue-500" />

            </div>

          </div>



          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-400 text-sm mb-1">Avg Team Size</p>

                <p className="text-2xl font-bold text-white">
                  {teams && teams.length > 0
                    ? (teams.reduce((acc, team) => acc + (((team.members && Array.isArray(team.members)) ? team.members.length : (team.teamMembers && Array.isArray(team.teamMembers)) ? team.teamMembers.length : 0)), 0) / teams.length).toFixed(1)
                    : '0'
                  }
                </p>

              </div>

              <Building2 className="w-8 h-8 text-purple-500" />

            </div>

          </div>

        </div>

    </div>

      </main >



    {/* Add Team Modal */ }

  {
    showAddModal && (

      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">

        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

          <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700 px-6 py-4 flex items-center justify-between">

            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">

              <Users className="w-6 h-6 text-cyan-400" />

              <span>{isEditing ? 'Edit Team' : 'Create New Team'}</span>

            </h3>

            <button

              onClick={() => resetNewTeam()}

              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"

            >

              <X className="w-5 h-5" />

            </button>

          </div>



          <div className="p-6 space-y-6">

            {/* Team Name */}

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-2">Team Name *</label>

              <input

                type="text"

                value={newTeam.teamName}

                onChange={(e) => setNewTeam({ ...newTeam, teamName: e.target.value })}

                placeholder="e.g., Internal Maintenance"

                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"

              />

            </div>



            {/* Team Members */}

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-2">Team Members *</label>



              {/* Add Member Input */}

              <div className="flex space-x-2 mb-3">

                <select

                  value={selectedUserId}

                  onChange={(e) => setSelectedUserId(e.target.value)}

                  className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"

                >

                  <option value="">Select a member</option>

                  {users.map(user => (

                    <option key={user._id} value={user._id}>

                      {user.firstName} {user.lastName} ({user.email})

                    </option>

                  ))}

                </select>

                <button

                  onClick={handleAddMember}

                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all flex items-center space-x-2"

                >

                  <UserPlus className="w-5 h-5" />

                  <span>Add</span>

                </button>

              </div>



              {/* Member List */}

              {newTeam.teamMembers.length > 0 && (

                <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">

                  <div className="flex flex-wrap gap-2">

                    {newTeam.teamMembers.map((member) => (

                      <div

                        key={member._id}

                        className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center space-x-2"

                      >

                        <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">

                          {member.firstName.charAt(0).toUpperCase()}

                        </div>

                        <span>{member.firstName} {member.lastName}</span>

                        <button

                          onClick={() => handleRemoveMember(member._id)}

                          className="ml-2 hover:bg-red-500/20 p-1 rounded transition-all"

                        >

                          <X className="w-4 h-4 text-red-400" />

                        </button>

                      </div>

                    ))}

                  </div>

                </div>

              )}



              {newTeam.teamMembers.length === 0 && (

                <p className="text-gray-500 text-sm">No members added yet. Add at least one member.</p>

              )}

            </div>



            {/* Company */}

            <div>

              <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>

              <div className="relative">

                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input

                  type="text"

                  value={newTeam.company}

                  onChange={(e) => setNewTeam({ ...newTeam, company: e.target.value })}

                  className="w-full pl-11 pr-4 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"

                />

              </div>

            </div>



            {/* Action Buttons */}

            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-700">

              <button

                onClick={() => resetNewTeam()}

                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-all"

              >

                Cancel

              </button>

              <button

                onClick={handleAddTeam}

                disabled={!newTeam.teamName || newTeam.teamMembers.length === 0}

                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed rounded-lg font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center space-x-2"

              >

                <Save className="w-5 h-5" />

                <span>{isEditing ? 'Save Changes' : 'Create Team'}</span>

              </button>

            </div>

          </div>

        </div>

      </div>

    )
  }

    </div >

  );

}
