const WorkCenter = require('../models/WorkCenter');

// @desc    Create new work center
// @route   POST /api/workcenters
// @access  Private
const createWorkCenter = async (req, res) => {
  try {
    const {
      name,
      code,
      tag,
      alternativeWorkcenter,
      costPerHour,
      capacity,
      timeEfficiency,
      oeeTarget,
      company,
    } = req.body;

    // Check if code already exists
    const existingWorkCenter = await WorkCenter.findOne({ code });
    if (existingWorkCenter) {
      return res.status(400).json({ message: 'Work center with this code already exists' });
    }

    const newWorkCenter = new WorkCenter({
      name,
      code,
      tag,
      alternativeWorkcenter,
      costPerHour: costPerHour || 0,
      capacity: capacity || 100,
      timeEfficiency: timeEfficiency || 100,
      oeeTarget: oeeTarget || 85,
      company,
    });

    const savedWorkCenter = await newWorkCenter.save();
    res.status(201).json(savedWorkCenter);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all work centers
// @route   GET /api/workcenters
// @access  Private
const getAllWorkCenters = async (req, res) => {
  try {
    const workCenters = await WorkCenter.find().sort({ createdAt: -1 });
    res.json(workCenters);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get work center by ID
// @route   GET /api/workcenters/:id
// @access  Private
const getWorkCenterById = async (req, res) => {
  try {
    const workCenter = await WorkCenter.findById(req.params.id);
    if (!workCenter) {
      return res.status(404).json({ message: 'Work center not found' });
    }
    res.json(workCenter);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update work center
// @route   PUT /api/workcenters/:id
// @access  Private
const updateWorkCenter = async (req, res) => {
  try {
    const {
      name,
      code,
      tag,
      alternativeWorkcenter,
      costPerHour,
      capacity,
      timeEfficiency,
      oeeTarget,
      company,
    } = req.body;

    const workCenter = await WorkCenter.findById(req.params.id);

    if (!workCenter) {
      return res.status(404).json({ message: 'Work center not found' });
    }

    // Check if code is being changed and if it conflicts with existing code
    if (code && code !== workCenter.code) {
      const existingWorkCenter = await WorkCenter.findOne({ code });
      if (existingWorkCenter) {
        return res.status(400).json({ message: 'Work center with this code already exists' });
      }
    }

    workCenter.name = name || workCenter.name;
    workCenter.code = code || workCenter.code;
    workCenter.tag = tag !== undefined ? tag : workCenter.tag;
    workCenter.alternativeWorkcenter = alternativeWorkcenter !== undefined ? alternativeWorkcenter : workCenter.alternativeWorkcenter;
    workCenter.costPerHour = costPerHour !== undefined ? costPerHour : workCenter.costPerHour;
    workCenter.capacity = capacity !== undefined ? capacity : workCenter.capacity;
    workCenter.timeEfficiency = timeEfficiency !== undefined ? timeEfficiency : workCenter.timeEfficiency;
    workCenter.oeeTarget = oeeTarget !== undefined ? oeeTarget : workCenter.oeeTarget;
    workCenter.company = company || workCenter.company;

    const updatedWorkCenter = await workCenter.save();
    res.json(updatedWorkCenter);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete work center
// @route   DELETE /api/workcenters/:id
// @access  Private
const deleteWorkCenter = async (req, res) => {
  try {
    const workCenter = await WorkCenter.findById(req.params.id);

    if (!workCenter) {
      return res.status(404).json({ message: 'Work center not found' });
    }

    await WorkCenter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Work center removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createWorkCenter,
  getAllWorkCenters,
  getWorkCenterById,
  updateWorkCenter,
  deleteWorkCenter,
};

