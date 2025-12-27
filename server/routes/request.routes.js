const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request.controller');
const { protect } = require('../middleware/auth.middleware');

// Example routes for maintenance requests
router.post('/', protect, requestController.createRequest);
router.get('/', protect, requestController.getAllRequests);
router.get('/:id', protect, requestController.getRequestById);
router.put('/:id', protect, requestController.updateRequest);
router.delete('/:id', protect, requestController.deleteRequest);

module.exports = router;