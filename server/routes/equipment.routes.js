const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { protect } = require('../middleware/auth.middleware');

// Example routes for equipment
router.post('/', protect, equipmentController.createEquipment);
router.get('/', protect, equipmentController.getAllEquipment);
router.get('/:id', protect, equipmentController.getEquipmentById);
router.put('/:id', protect, equipmentController.updateEquipment);
router.delete('/:id', protect, equipmentController.deleteEquipment);

module.exports = router;