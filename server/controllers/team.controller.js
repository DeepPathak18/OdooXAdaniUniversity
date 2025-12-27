const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');

// @desc    Create a new maintenance team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { teamName, company, members, leader, specialty } = req.body;

    // Validate required fields
    if (!teamName || !company) {
      return res.status(400).json({ message: 'Team name and company are required' });
    }

    const newTeam = new MaintenanceTeam({
      teamName,
      company,
      members: members || [], // Array of User ObjectIds
      leader: leader || undefined,
      specialty: specialty || undefined,
    });

    const savedTeam = await newTeam.save();
    // Re-query and populate to ensure we return populated member docs
    const populatedTeam = await MaintenanceTeam.findById(savedTeam._id)
      .populate('members', 'firstName lastName email')
      .populate('leader', 'firstName lastName email');

    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all maintenance teams
// @route   GET /api/teams
// @access  Private
const getAllTeams = async (req, res) => {
  try {
    const teams = await MaintenanceTeam.find()
      .populate('members', 'firstName lastName email')
      .populate('leader', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a maintenance team by ID
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id)
      .populate('members', 'firstName lastName email')
      .populate('leader', 'firstName lastName email');
    if (!team) {
      return res.status(404).json({ message: 'Maintenance team not found' });
    }
    
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a maintenance team
// @route   PUT /api/teams/:id
// @access  Private
const updateTeam = async (req, res) => {
  try {
    const { teamName, company, members, leader, specialty } = req.body;

    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Maintenance team not found' });
    }

    team.teamName = teamName !== undefined ? teamName : team.teamName;
    team.company = company !== undefined ? company : team.company;
    team.members = members !== undefined ? members : team.members;
    team.leader = leader !== undefined ? (leader || undefined) : team.leader;
    team.specialty = specialty !== undefined ? (specialty || undefined) : team.specialty;

    const updatedTeam = await team.save();
    // Re-query & populate to ensure members have firstName/lastName
    const populatedUpdatedTeam = await MaintenanceTeam.findById(updatedTeam._id)
      .populate('members', 'firstName lastName email')
      .populate('leader', 'firstName lastName email');

    res.json(populatedUpdatedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a maintenance team
// @route   DELETE /api/teams/:id
// @access  Private
const deleteTeam = async (req, res) => {
  try {
    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Maintenance team not found' });
    }

    await MaintenanceTeam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Maintenance team removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
