const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { protect } = require('../middleware/auth.middleware');

// Example routes for maintenance teams
router.post('/', protect, teamController.createTeam);
router.get('/', protect, teamController.getAllTeams);
router.get('/:id', protect, teamController.getTeamById);
router.put('/:id', protect, teamController.updateTeam);
router.delete('/:id', protect, teamController.deleteTeam);

module.exports = router;