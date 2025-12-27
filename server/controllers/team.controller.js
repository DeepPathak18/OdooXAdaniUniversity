const MaintenanceTeam = require('../models/MaintenanceTeam');
const User = require('../models/User');

// Helper function to escape regex special characters
const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Helper function to convert team member names to User ObjectIds
const convertMemberNamesToIds = async (teamMembers) => {
  if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
    return [];
  }

  const memberIds = [];
  const mongoose = require('mongoose');
  
  for (const memberName of teamMembers) {
    if (!memberName) continue;
    
    // Handle both string names and ObjectIds
    const trimmedName = String(memberName).trim();
    if (!trimmedName) continue;
    
    // Check if it's already an ObjectId
    if (mongoose.Types.ObjectId.isValid(trimmedName)) {
      const user = await User.findById(trimmedName);
      if (user) {
        memberIds.push(user._id);
        continue;
      }
    }
    
    // Split name into parts for searching
    const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);

    // 1) If looks like an email, try email lookup
    if (trimmedName.includes('@')) {
      const userByEmail = await User.findOne({ email: { $regex: `^${escapeRegex(trimmedName)}$`, $options: 'i' } });
      if (userByEmail) {
        memberIds.push(userByEmail._id);
        continue;
      }
    }

    // 2) If name has at least two parts, try matching firstName + lastName (case-insensitive)
    if (nameParts.length >= 2) {
      const firstName = escapeRegex(nameParts[0]);
      const lastName = escapeRegex(nameParts.slice(1).join(' '));

      let user = await User.findOne({
        firstName: { $regex: `^${firstName}$`, $options: 'i' },
        lastName: { $regex: `^${lastName}$`, $options: 'i' }
      });

      if (user) {
        memberIds.push(user._id);
        continue;
      }

      // Try looser match: firstName startsWith and lastName startsWith
      user = await User.findOne({
        firstName: { $regex: `^${firstName}`, $options: 'i' },
        lastName: { $regex: `^${lastName}`, $options: 'i' }
      });
      if (user) {
        memberIds.push(user._id);
        continue;
      }
    }

    // 3) Try matching by username, email (partial), firstName or lastName (loose)
    const looseRegex = new RegExp(escapeRegex(trimmedName), 'i');
    let user = await User.findOne({
      $or: [
        { username: { $regex: looseRegex } },
        { email: { $regex: looseRegex } },
        { firstName: { $regex: looseRegex } },
        { lastName: { $regex: looseRegex } }
      ]
    });
    if (user) {
      memberIds.push(user._id);
      continue;
    }

    // If no user found, log a warning so admin can correct names on the frontend
    console.warn(`User not found for team member name: "${trimmedName}"`);
  }
  
  return memberIds;
};

// @desc    Create a new maintenance team
// @route   POST /api/teams
// @access  Private
const createTeam = async (req, res) => {
  try {
    const { teamName, company, members, teamMembers, leader, specialty } = req.body;

    // Validate required fields
    if (!teamName || !company) {
      return res.status(400).json({ message: 'Team name and company are required' });
    }

    // Convert teamMembers (names) to ObjectIds if provided, otherwise use members (ObjectIds)
    let memberIds = [];
    if (teamMembers && Array.isArray(teamMembers) && teamMembers.length > 0) {
      // Frontend sends teamMembers as array of names - convert to ObjectIds
      console.log('Converting team members:', teamMembers);
      memberIds = await convertMemberNamesToIds(teamMembers);
      console.log('Converted to ObjectIds:', memberIds);
      
      // Allow teams with no members (empty array) but warn if conversion failed
      if (memberIds.length === 0 && teamMembers.length > 0) {
        console.warn('Warning: No users found for team member names:', teamMembers);
        // Still allow creation but with empty members array
      }
    } else if (members && Array.isArray(members)) {
      // Frontend sends members as ObjectIds directly
      memberIds = members.filter(id => id);
    }

    const newTeam = new MaintenanceTeam({
      teamName,
      company,
      members: memberIds, // Array of User ObjectIds
      leader: leader || undefined,
      specialty: specialty || undefined,
    });

    const savedTeam = await newTeam.save();
    // Re-query and populate to ensure we return populated member docs
    const populatedTeam = await MaintenanceTeam.findById(savedTeam._id)
      .populate('members', 'firstName lastName')
      .populate('leader', 'firstName lastName');

    const transformedTeam = {
      _id: populatedTeam._id,
      id: populatedTeam._id,
      teamName: populatedTeam.teamName,
      company: populatedTeam.company,
      teamMembers: populatedTeam.members && populatedTeam.members.length > 0
        ? populatedTeam.members.map(member => `${member.firstName || ''} ${member.lastName || ''}`.trim()).filter(Boolean)
        : [],
      members: populatedTeam.members,
      memberIds: populatedTeam.members ? populatedTeam.members.map(m => m._id || m) : [],
      leader: populatedTeam.leader,
      specialty: populatedTeam.specialty,
      createdAt: populatedTeam.createdAt,
      updatedAt: populatedTeam.updatedAt,
    };

    res.status(201).json(transformedTeam);
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
      .populate('leader', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    // Transform data to match frontend expectations
    const transformedTeams = teams.map(team => ({
      _id: team._id,
      id: team._id,
      teamName: team.teamName,
      company: team.company,
      teamMembers: team.members && team.members.length > 0 
        ? team.members.map(member => `${member.firstName || ''} ${member.lastName || ''}`.trim()).filter(Boolean)
        : [],
      members: team.members,
      memberIds: team.members ? team.members.map(m => m._id || m) : [], // Array of ObjectIds for frontend
      leader: team.leader,
      specialty: team.specialty,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }));
    
    res.json(transformedTeams);
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
    
    // Transform response to match frontend expectations
    const transformedTeam = {
      _id: team._id,
      id: team._id,
      teamName: team.teamName,
      company: team.company,
      teamMembers: team.members && team.members.length > 0
        ? team.members.map(member => `${member.firstName || ''} ${member.lastName || ''}`.trim()).filter(Boolean)
        : [],
      members: team.members,
      memberIds: team.members ? team.members.map(m => m._id || m) : [],
      leader: team.leader,
      specialty: team.specialty,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
    
    res.json(transformedTeam);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a maintenance team
// @route   PUT /api/teams/:id
// @access  Private
const updateTeam = async (req, res) => {
  try {
    const { teamName, company, members, teamMembers, leader, specialty } = req.body;

    const team = await MaintenanceTeam.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Maintenance team not found' });
    }

    team.teamName = teamName !== undefined ? teamName : team.teamName;
    team.company = company !== undefined ? company : team.company;
    
    // Update members - convert teamMembers (names) to ObjectIds if provided
    if (teamMembers !== undefined) {
      if (Array.isArray(teamMembers) && teamMembers.length > 0) {
        // Frontend sends teamMembers as array of names - convert to ObjectIds
        console.log('Updating team members:', teamMembers);
        const memberIds = await convertMemberNamesToIds(teamMembers);
        console.log('Converted to ObjectIds:', memberIds);
        
        // Allow update even if some members not found (use found ones)
        team.members = memberIds;
      } else {
        team.members = [];
      }
    } else if (members !== undefined) {
      // Frontend sends members as ObjectIds directly
      team.members = Array.isArray(members) ? members.filter(id => id) : [];
    }
    
    team.leader = leader !== undefined ? (leader || undefined) : team.leader;
    team.specialty = specialty !== undefined ? (specialty || undefined) : team.specialty;

    const updatedTeam = await team.save();
    // Re-query & populate to ensure members have firstName/lastName
    const populatedUpdatedTeam = await MaintenanceTeam.findById(updatedTeam._id)
      .populate('members', 'firstName lastName')
      .populate('leader', 'firstName lastName');

    const transformedTeam = {
      _id: populatedUpdatedTeam._id,
      id: populatedUpdatedTeam._id,
      teamName: populatedUpdatedTeam.teamName,
      company: populatedUpdatedTeam.company,
      teamMembers: populatedUpdatedTeam.members && populatedUpdatedTeam.members.length > 0
        ? populatedUpdatedTeam.members.map(member => `${member.firstName || ''} ${member.lastName || ''}`.trim()).filter(Boolean)
        : [],
      members: populatedUpdatedTeam.members,
      memberIds: populatedUpdatedTeam.members ? populatedUpdatedTeam.members.map(m => m._id || m) : [],
      leader: populatedUpdatedTeam.leader,
      specialty: populatedUpdatedTeam.specialty,
      createdAt: populatedUpdatedTeam.createdAt,
      updatedAt: populatedUpdatedTeam.updatedAt,
    };

    res.json(transformedTeam);
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
