const Equipment = require('../models/Equipment');

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private
const createEquipment = async (req, res) => {
  try {
    const {
      name,
      category,
      company,
      usedByType,
      assignedEmployee,
      technician,
      maintenanceTeam,
      assignedDate,
      scrapDate,
      location,
      workCenter,
      status,
      description,
    } = req.body;

    const newEquipment = new Equipment({
      name,
      category,
      company,
      usedByType,
      assignedEmployee,
      technician,
      maintenanceTeam,
      assignedDate,
      scrapDate,
      location,
      workCenter,
      status,
      description,
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Private
const getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find()
      .populate('assignedEmployee', 'firstName lastName')
      .populate('technician', 'firstName lastName')
      .populate('maintenanceTeam', 'teamName');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Private
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
      .populate('assignedEmployee', 'firstName lastName')
      .populate('technician', 'firstName lastName')
      .populate('maintenanceTeam', 'teamName');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
const updateEquipment = async (req, res) => {
  try {
    const {
      name,
      category,
      company,
      usedByType,
      assignedEmployee,
      technician,
      maintenanceTeam,
      assignedDate,
      scrapDate,
      location,
      workCenter,
      status,
      description,
    } = req.body;

    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    equipment.name = name || equipment.name;
    equipment.category = category || equipment.category;
    equipment.company = company || equipment.company;
    equipment.usedByType = usedByType || equipment.usedByType;
    equipment.assignedEmployee = assignedEmployee || equipment.assignedEmployee;
    equipment.technician = technician || equipment.technician;
    equipment.maintenanceTeam = maintenanceTeam || equipment.maintenanceTeam;
    equipment.assignedDate = assignedDate || equipment.assignedDate;
    equipment.scrapDate = scrapDate || equipment.scrapDate;
    equipment.location = location || equipment.location;
    equipment.workCenter = workCenter || equipment.workCenter;
    equipment.status = status || equipment.status;
    equipment.description = description || equipment.description;

    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    await Equipment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Equipment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
