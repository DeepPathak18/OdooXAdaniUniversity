const MaintenanceRequest = require('../models/MaintenanceRequest');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');

/* ======================================================
   GET CALENDAR EVENTS
====================================================== */
const getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query;

    let filter = { scheduledDate: { $exists: true, $ne: null } };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      filter.scheduledDate = { $gte: startDate, $lt: endDate };
    }

    const events = await MaintenanceRequest.find(filter)
      .populate('createdBy', 'firstName lastName')
      .populate('equipment', 'name')
      .populate('team', 'teamName')
      .populate('technician', 'firstName lastName')
      .sort({ scheduledDate: 1 });

    const formattedEvents = events.map(event => ({
      id: event._id,
      subject: event.subject,
      date: event.scheduledDate,
      day: event.scheduledDate.getDate(),
      month: event.scheduledDate.getMonth(),
      year: event.scheduledDate.getFullYear(),
      time: event.scheduledDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: event.status || 'scheduled',
      priority: event.priority,
      category: event.category,
      maintenanceType: event.maintenanceType,
      equipment: event.equipment?.name || 'Unknown Equipment',
      technician: event.technician
        ? `${event.technician.firstName} ${event.technician.lastName}`
        : 'Unassigned',
      team: event.team?.teamName || 'Unknown Team',
      durationHours: event.durationHours,
      notes: event.notes
    }));

    res.status(200).json(formattedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/* ======================================================
   DASHBOARD DATA
====================================================== */
const getDashboardData = async (req, res) => {
  try {
    const totalRequests = await MaintenanceRequest.countDocuments();
    const completedRequests = await MaintenanceRequest.countDocuments({ status: 'Repaired' });
    const inProgressRequests = await MaintenanceRequest.countDocuments({ status: 'In Progress' });
    const pendingRequests = await MaintenanceRequest.countDocuments({ status: 'New' });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const overdueRequests = await MaintenanceRequest.countDocuments({
      status: { $nin: ['Repaired', 'Scrap'] },
      scheduledDate: { $lt: now, $exists: true }
    });

    const completedToday = await MaintenanceRequest.countDocuments({
      status: 'Repaired',
      updatedAt: { $gte: today }
    });

    const underRepairEquipment = inProgressRequests;

    const activeTechnicians = await MaintenanceRequest.distinct('technician', {
      status: 'In Progress'
    });
    const allTechnicians = await MaintenanceRequest.distinct('technician');
    const totalTechnicians = allTechnicians.filter(id => id).length;
    const technicianUtilization = totalTechnicians > 0 ? Math.round((activeTechnicians.filter(id => id).length / totalTechnicians) * 100) : 0;

    const avgResponseTime = 2.4; // Placeholder

    const totalEquipment = await Equipment.countDocuments();
    const scrappedEquipment = await Equipment.countDocuments({ status: 'Scrapped' });
    const equipmentHealth = totalEquipment > 0 ? Math.round(((totalEquipment - scrappedEquipment) / totalEquipment) * 100) : 100;

    const priorityAgg = await MaintenanceRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const priorityDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
    priorityAgg.forEach(p => {
      if (p._id) priorityDistribution[p._id.toLowerCase()] = p.count;
    });

    const recentRequests = await MaintenanceRequest.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('equipment', 'name')
      .populate('technician', 'firstName lastName');

    const upcomingMaintenance = await MaintenanceRequest.find({
      scheduledDate: { $gte: now, $lte: next7Days }
    })
      .sort({ scheduledDate: 1 })
      .populate('equipment', 'name')
      .populate('technician', 'firstName lastName');

    // Add trends data
    const monthlyTrendData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Completed',
          data: [completedRequests, completedRequests, completedRequests, completedRequests, completedRequests, completedRequests],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
        {
          label: 'In Progress',
          data: [inProgressRequests, inProgressRequests, inProgressRequests, inProgressRequests, inProgressRequests, inProgressRequests],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Pending',
          data: [pendingRequests, pendingRequests, pendingRequests, pendingRequests, pendingRequests, pendingRequests],
          borderColor: 'rgb(234, 179, 8)',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          tension: 0.4,
        },
      ],
    };

    const statusData = {
      labels: ['Completed', 'In Progress', 'Pending', 'Scrap'],
      datasets: [
        {
          label: 'Requests',
          data: [completedRequests, inProgressRequests, pendingRequests, scrappedEquipment],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(234, 179, 8)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
        },
      ],
    };

    res.status(200).json({
      statistics: {
        underRepairEquipment,
        technicianUtilization,
        pendingRequests,
        overdueRequests,
        completedToday,
        avgResponseTime,
        activeTechnicians: activeTechnicians.filter(id => id).length,
        totalTechnicians,
        equipmentHealth
      },
      recentRequests: recentRequests.map(req => ({
        _id: req._id,
        subject: req.subject,
        equipment: req.equipment,
        technician: req.technician,
        priority: req.priority,
        status: req.status,
        createdAt: req.createdAt
      })),
      upcomingMaintenance: upcomingMaintenance.map(req => ({
        _id: req._id,
        subject: req.subject,
        equipment: req.equipment,
        technician: req.technician,
        scheduledDate: req.scheduledDate
      })),
      trends: {
        monthlyTrendData,
        statusData
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/* ======================================================
   MAINTENANCE TRENDS (MOCK DATA)
====================================================== */
const getMaintenanceTrends = async (req, res) => {
  try {
    res.status(200).json({
      monthlyTrendData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Completed', data: [12, 15, 18, 14, 16, 20] },
          { label: 'In Progress', data: [5, 7, 6, 8, 9, 7] },
          { label: 'Pending', data: [3, 2, 4, 3, 5, 4] }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/* ======================================================
   CREATE SAMPLE EVENTS
====================================================== */
const createSampleEvents = async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
    }

    let equipment = await Equipment.findOne();
    if (!equipment) {
      equipment = await Equipment.create({
        name: 'Sample Equipment',
        category: 'General',
        serialNumber: 'TEST-001'
      });
    }

    let team = await MaintenanceTeam.findOne();
    if (!team) {
      team = await MaintenanceTeam.create({
        teamName: 'Sample Team',
        teamMembers: [user._id]
      });
    }

    const events = await MaintenanceRequest.insertMany([
      {
        subject: 'HVAC Maintenance',
        createdBy: user._id,
        equipment: equipment._id,
        team: team._id,
        technician: user._id,
        scheduledDate: new Date(),
        priority: 'Medium',
        status: 'In Progress'
      }
    ]);

    res.status(201).json({ message: 'Sample events created', events });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/* ======================================================
   EXPORTS
====================================================== */
module.exports = {
  getCalendarEvents,
  getDashboardData,
  getMaintenanceTrends,
  createSampleEvents
};