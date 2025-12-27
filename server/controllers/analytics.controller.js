const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get calendar events (maintenance requests with scheduled dates)
// @route   GET /api/analytics/calendar-events
// @access  Private
const getCalendarEvents = async (req, res) => {
  try {
    const { month, year } = req.query;

    // If month and year are provided, filter by that month
    let filter = { scheduledDate: { $exists: true, $ne: null } };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1); // month is 1-indexed in query
      const endDate = new Date(year, month, 1); // end of the month
      filter.scheduledDate = {
        ...filter.scheduledDate,
        $gte: startDate,
        $lt: endDate
      };
    }

    const events = await MaintenanceRequest.find(filter)
      .populate('createdBy', 'firstName lastName')
      .populate('equipment', 'name')
      .populate('team', 'teamName')
      .populate('technician', 'firstName lastName')
      .sort({ scheduledDate: 1 });

    // Format events for calendar display
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
      technician: event.technician ? `${event.technician.firstName} ${event.technician.lastName}` : 'Unassigned',
      team: event.team?.teamName || 'Unknown Team',
      durationHours: event.durationHours,
      notes: event.notes
    }));

    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard-data
// @access  Private


// @desc    Get maintenance trends data
// @route   GET /api/analytics/maintenance-trends
// @access  Private


// @desc    Create sample calendar events for testing
// @route   POST /api/analytics/create-sample-events
// @access  Private
const createSampleEvents = async (req, res) => {
  try {
    const MaintenanceRequest = require('../models/MaintenanceRequest');
    const User = require('../models/User');
    const Equipment = require('../models/Equipment');
    const MaintenanceTeam = require('../models/MaintenanceTeam');

    // Get some existing data or create sample data
    let user = await User.findOne();
    if (!user) {
      user = new User({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
    }

    let equipment = await Equipment.findOne();
    if (!equipment) {
      equipment = new Equipment({
        name: 'Sample Equipment',
        category: 'Computer',
        serialNumber: 'TEST-001'
      });
      await equipment.save();
    }

    let team = await MaintenanceTeam.findOne();
    if (!team) {
      team = new MaintenanceTeam({
        teamName: 'Sample Team',
        teamMembers: [user._id]
      });
      await team.save();
    }

    // Create sample maintenance requests with scheduled dates
    const sampleEvents = [
      {
        subject: 'HVAC System Maintenance',
        createdBy: user._id,
        equipment: equipment._id,
        category: 'HVAC',
        maintenanceType: 'Preventive',
        team: team._id,
        technician: user._id,
        scheduledDate: new Date(2024, 11, 15, 10, 0), // Dec 15, 2024, 10:00 AM
        durationHours: 2,
        priority: 'Medium',
        status: 'scheduled',
        notes: 'Regular HVAC maintenance check'
      },
      {
        subject: 'Electrical Panel Inspection',
        createdBy: user._id,
        equipment: equipment._id,
        category: 'Electrical',
        maintenanceType: 'Preventive',
        team: team._id,
        technician: user._id,
        scheduledDate: new Date(2024, 11, 20, 14, 30), // Dec 20, 2024, 2:30 PM
        durationHours: 1.5,
        priority: 'High',
        status: 'scheduled',
        notes: 'Monthly electrical inspection'
      },
      {
        subject: 'Server Room Cooling Check',
        createdBy: user._id,
        equipment: equipment._id,
        category: 'HVAC',
        maintenanceType: 'Corrective',
        team: team._id,
        technician: user._id,
        scheduledDate: new Date(2024, 11, 25, 9, 0), // Dec 25, 2024, 9:00 AM
        durationHours: 3,
        priority: 'Critical',
        status: 'in-progress',
        notes: 'Urgent cooling system repair'
      }
    ];

    const createdEvents = await MaintenanceRequest.insertMany(sampleEvents);

    res.json({
      message: 'Sample events created successfully',
      events: createdEvents.length,
      data: createdEvents
    });
  } catch (error) {
    console.error('Error creating sample events:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Exported at end of file after all functions are declared

const getDashboardData = async (req, res) => {
  try {
    // Basic counts
    const totalRequests = await MaintenanceRequest.countDocuments();
    const completedRequests = await MaintenanceRequest.countDocuments({ status: 'Repaired' });
    const inProgressRequests = await MaintenanceRequest.countDocuments({ status: 'In Progress' });
    const pendingRequests = await MaintenanceRequest.countDocuments({ status: 'New' });

    // Average completion time (hours) for repaired requests
    const completionAgg = await MaintenanceRequest.aggregate([
      { $match: { status: 'Repaired', requestDate: { $exists: true }, updatedAt: { $exists: true } } },
      { $project: { diffHours: { $divide: [{ $subtract: ['$updatedAt', '$requestDate'] }, 1000 * 60 * 60] } } },
      { $group: { _id: null, avgCompletionHours: { $avg: '$diffHours' }, minHours: { $min: '$diffHours' }, maxHours: { $max: '$diffHours' } } },
    ]);

    const averageCompletionTime = completionAgg[0] ? Number(completionAgg[0].avgCompletionHours.toFixed(2)) : 0;
    const responseTimeBreakdown = completionAgg[0]
      ? {
          average: Number(completionAgg[0].avgCompletionHours.toFixed(2)),
          fastest: Number(completionAgg[0].minHours.toFixed(2)),
          slowest: Number(completionAgg[0].maxHours.toFixed(2)),
        }
      : { average: 0, fastest: 0, slowest: 0 };

    // For response time, use scheduledDate - requestDate where available
    const responseAgg = await MaintenanceRequest.aggregate([
      { $match: { scheduledDate: { $exists: true, $ne: null }, requestDate: { $exists: true } } },
      { $project: { diffHours: { $divide: [{ $subtract: ['$scheduledDate', '$requestDate'] }, 1000 * 60 * 60] } } },
      { $group: { _id: null, avgResponseHours: { $avg: '$diffHours' } } },
    ]);

    const averageResponseTime = responseAgg[0] ? Number(responseAgg[0].avgResponseHours.toFixed(2)) : averageCompletionTime;

    // Priority distribution
    const priorityAgg = await MaintenanceRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    const priorityDistribution = { critical: 0, high: 0, medium: 0, low: 0 };
    priorityAgg.forEach(p => {
      if (!p._id) return;
      const key = p._id.toLowerCase();
      if (key === 'critical') priorityDistribution.critical = p.count;
      else if (key === 'high') priorityDistribution.high = p.count;
      else if (key === 'medium') priorityDistribution.medium = p.count;
      else if (key === 'low') priorityDistribution.low = p.count;
    });

    // Recent activity: this week and this month (based on updatedAt)
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekCompleted = await MaintenanceRequest.countDocuments({ status: 'Repaired', updatedAt: { $gte: weekAgo } });
    const thisWeekInProgress = await MaintenanceRequest.countDocuments({ status: 'In Progress', updatedAt: { $gte: weekAgo } });

    const thisMonthCompleted = await MaintenanceRequest.countDocuments({ status: 'Repaired', updatedAt: { $gte: monthAgo } });
    const thisMonthInProgress = await MaintenanceRequest.countDocuments({ status: 'In Progress', updatedAt: { $gte: monthAgo } });

    // Equipment health: percentage of equipment not scrapped
    const Equipment = require('../models/Equipment');
    const totalEquipment = await Equipment.countDocuments();
    const scrappedEquipment = await Equipment.countDocuments({ status: 'Scrapped' });
    const equipmentHealth = totalEquipment > 0 ? Math.round(((totalEquipment - scrappedEquipment) / totalEquipment) * 100) : 100;

    // Recent requests list
    const recentRequests = await MaintenanceRequest.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('equipment', 'name')
      .populate('technician', 'firstName lastName')
      .populate('team', 'teamName')
      .populate('createdBy', 'firstName lastName');

    // Upcoming maintenance (next 7 days)
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingMaintenance = await MaintenanceRequest.find({ scheduledDate: { $gte: now, $lte: inSevenDays } })
      .sort({ scheduledDate: 1 })
      .limit(10)
      .populate('equipment', 'name')
      .populate('technician', 'firstName lastName')
      .populate('team', 'teamName');

    // Top active technicians by assigned open requests
    const techAgg = await MaintenanceRequest.aggregate([
      { $match: { technician: { $exists: true, $ne: null } } },
      { $group: { _id: '$technician', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const User = require('../models/User');
    const activeTechnicians = [];
    for (const t of techAgg) {
      try {
        const user = await User.findById(t._id).select('firstName lastName email');
        if (user) activeTechnicians.push({ technician: `${user.firstName} ${user.lastName}`, count: t.count });
      } catch (e) {
        // ignore
      }
    }

    const dashboardData = {
      totalRequests,
      completedRequests,
      inProgressRequests,
      pendingRequests,
      averageResponseTime,
      averageCompletionTime,
      criticalIssues: priorityDistribution.critical || 0,
      equipmentHealth,
      responseTimeBreakdown,
      completionStats: {
        average: averageCompletionTime,
        completionRate: totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0,
        onTimeCompletion: 0, // requires SLA logic - placeholder
      },
      priorityDistribution,
      recentActivity: {
        thisWeek: { completed: thisWeekCompleted, inProgress: thisWeekInProgress, vsLastWeek: 'N/A' },
        thisMonth: { completed: thisMonthCompleted, inProgress: thisMonthInProgress, vsLastMonth: 'N/A' },
        equipmentStatus: { healthy: equipmentHealth, criticalIssues: priorityDistribution.critical || 0, vsLastMonth: 'N/A' },
      },
      recentRequests,
      upcomingMaintenance,
      activeTechnicians,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data', error: error.message });
  }
};

const getMaintenanceTrends = (req, res) => {
    try {
        // In a real application, dateRange and categoryFilter would be used
        // to query the database and aggregate data.
        const { dateRange, categoryFilter } = req.query;

        // Mock data based on the original component's mock data
        const monthlyTrendData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Completed',
                    data: [12, 15, 18, 14, 16, 20, 22, 19, 21, 18, 16, 14],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                },
                {
                    label: 'In Progress',
                    data: [5, 7, 6, 8, 9, 7, 8, 6, 7, 5, 4, 3],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                },
                {
                    label: 'Pending',
                    data: [3, 2, 4, 3, 5, 4, 3, 2, 3, 4, 5, 6],
                    borderColor: 'rgb(234, 179, 8)',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    tension: 0.4,
                },
            ],
        };

        const statusData = {
            labels: ['Completed', 'In Progress', 'Pending', 'Scrapped'],
            datasets: [
                {
                    label: 'Requests',
                    data: [128, 18, 10, 5],
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

        const categoryData = {
            labels: ['Computers', 'HVAC', 'Electrical', 'Network', 'Office Equipment'],
            datasets: [
                {
                    label: 'Requests',
                    data: [45, 32, 28, 25, 26],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(234, 179, 8, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(168, 85, 247)',
                        'rgb(234, 179, 8)',
                        'rgb(34, 197, 94)',
                        'rgb(239, 68, 68)',
                    ],
                    borderWidth: 2,
                },
            ],
        };

        const performanceData = {
            labels: ['Response Time (h)', 'Resolution Time (h)', 'First Contact (h)', 'SLA Compliance (%)'],
            datasets: [
                {
                    label: 'Current Month',
                    data: [2.4, 5.2, 1.8, 92],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                },
                {
                    label: 'Last Month',
                    data: [2.8, 5.8, 2.1, 88],
                    backgroundColor: 'rgba(168, 85, 247, 0.8)',
                    borderColor: 'rgb(168, 85, 247)',
                    borderWidth: 2,
                },
            ],
        };

        res.status(200).json({
            monthlyTrendData,
            statusData,
            categoryData,
            performanceData,
        });
    } catch (error) {
        console.error('Error fetching maintenance trends:', error);
        res.status(500).json({ message: 'Server error fetching maintenance trends' });
    }
};

module.exports = {
  getCalendarEvents,
  getDashboardData,
  getMaintenanceTrends,
  createSampleEvents,
};
