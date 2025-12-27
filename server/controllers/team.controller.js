const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');

// @desc    Create a new maintenance team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { teamName, company, members, leader, specialty } = req.body;

    const newTeam = new MaintenanceTeam({
      teamName,
      company,
      members,
      leader,
      specialty,
    });

    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
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
      .populate('members', 'firstName lastName')
      .populate('leader', 'firstName lastName');
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
      .populate('members', 'firstName lastName')
      .populate('leader', 'firstName lastName');
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

    team.teamName = teamName || team.teamName;
    team.company = company || team.company;
    team.members = members || team.members;
    team.leader = leader || team.leader;
    team.specialty = specialty || team.specialty;

    const updatedTeam = await team.save();
    res.json(updatedTeam);
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

    await team.remove();
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
