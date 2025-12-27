const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Create a new maintenance request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
  try {
    const {
      subject,
      equipment,
      category,
      maintenanceType,
      team,
      technician,
      scheduledDate,
      durationHours,
      priority,
      company,
      status,
      notes,
      instructions,
    } = req.body;

    const newRequest = new MaintenanceRequest({
      subject,
      createdBy: req.user.id,
      equipment,
      category,
      maintenanceType,
      team,
      technician,
      scheduledDate,
      durationHours,
      priority,
      company,
      status,
      notes,
      instructions,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all maintenance requests
// @route   GET /api/requests
// @access  Private
const getAllRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate('createdBy', 'firstName lastName')
      .populate('equipment', 'name')
      .populate('team', 'teamName')
      .populate('technician', 'firstName lastName');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a maintenance request by ID
// @route   GET /api/requests/:id
// @access  Private
const getRequestById = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('equipment', 'name')
      .populate('team', 'teamName')
      .populate('technician', 'firstName lastName');
    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a maintenance request
// @route   PUT /api/requests/:id
// @access  Private
const updateRequest = async (req, res) => {
  try {
    const {
      subject,
      equipment,
      category,
      maintenanceType,
      team,
      technician,
      scheduledDate,
      durationHours,
      priority,
      company,
      status,
      notes,
      instructions,
    } = req.body;

    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    request.subject = subject || request.subject;
    request.equipment = equipment || request.equipment;
    request.category = category || request.category;
    request.maintenanceType = maintenanceType || request.maintenanceType;
    request.team = team || request.team;
    request.technician = technician || request.technician;
    request.scheduledDate = scheduledDate || request.scheduledDate;
    request.durationHours = durationHours || request.durationHours;
    request.priority = priority || request.priority;
    request.company = company || request.company;
    request.status = status || request.status;
    request.notes = notes || request.notes;
    request.instructions = instructions || request.instructions;

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a maintenance request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    await request.remove();
    res.json({ message: 'Maintenance request removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
};
