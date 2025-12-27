const express = require('express');
const router = express.Router();
const workCenterController = require('../controllers/workcenter.controller');
const { protect } = require('../middleware/auth.middleware');

// Routes for work centers
router.post('/', protect, workCenterController.createWorkCenter);
router.get('/', protect, workCenterController.getAllWorkCenters);
router.get('/:id', protect, workCenterController.getWorkCenterById);
router.put('/:id', protect, workCenterController.updateWorkCenter);
router.delete('/:id', protect, workCenterController.deleteWorkCenter);

module.exports = router;

