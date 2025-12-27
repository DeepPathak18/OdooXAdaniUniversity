const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

// Example routes for analytics
router.get('/dashboard-data', protect, analyticsController.getDashboardData);
router.get('/maintenance-trends', protect, analyticsController.getMaintenanceTrends);

module.exports = router;