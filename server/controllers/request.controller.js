const MaintenanceRequest = require('../models/MaintenanceRequest');
const { sendMaintenanceRequestNotification, sendCompletionNotification, sendOverdueNotification } = require('../services/notification.service');

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

    // Send notifications if technician is assigned
    if (technician) {
      try {
        // For now, we'll skip WebSocket notifications since io is not available in controllers
        // In a full implementation, you'd pass io through middleware or use a different approach
        await sendMaintenanceRequestNotification(null, technician, savedRequest, 'assigned');
      } catch (notificationError) {
        console.error('Error sending notification:', notificationError);
        // Don't fail the request if notification fails
      }
    }

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

    const oldStatus = request.status;
    const oldTechnician = request.technician ? String(request.technician) : null;

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

    // Send notifications based on changes
    try {
      // If technician changed, notify new technician
      if (technician && String(technician) !== oldTechnician) {
        await sendMaintenanceRequestNotification(null, technician, updatedRequest, 'assigned');
      }

      // If status changed to a completed-like state (Repaired), notify creator
      const newStatusNormalized = (status || '').toString().toLowerCase();
      const oldStatusNormalized = (oldStatus || '').toString().toLowerCase();
      if (newStatusNormalized === 'repaired' && oldStatusNormalized !== 'repaired') {
        await sendCompletionNotification(null, updatedRequest.createdBy, updatedRequest);
      }
    } catch (notificationError) {
      console.error('Error sending notification:', notificationError);
      // Don't fail the request if notification fails
    }

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

// @desc    Check for overdue maintenance requests and send notifications
// @route   POST /api/requests/check-overdue
// @access  Private/Admin
const checkOverdueRequests = async (req, res) => {
  try {
    const now = new Date();
    // Use the project's status enum values (New, In Progress, Repaired, Scrap)
    // Consider 'New' and 'In Progress' as outstanding states
    const overdueRequests = await MaintenanceRequest.find({
      status: { $in: ['New', 'In Progress'] },
      scheduledDate: { $lt: now }
    }).populate('technician', 'firstName lastName');

    let notificationsSent = 0;

    for (const request of overdueRequests) {
      if (request.technician) {
        try {
          await sendOverdueNotification(null, request.technician._id, request);
          notificationsSent++;
        } catch (notificationError) {
          console.error('Error sending overdue notification:', notificationError);
        }
      }
    }

    res.json({
      message: `Checked ${overdueRequests.length} overdue requests, sent ${notificationsSent} notifications`
    });
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
  checkOverdueRequests,
};
