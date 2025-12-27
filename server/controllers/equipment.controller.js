const Equipment = require('../models/Equipment');

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private
const createEquipment = async (req, res) => {
  try {
    const {
      name,
      equipmentName,  // Frontend uses equipmentName
      category,
      equipmentCategory,  // Frontend uses equipmentCategory
      company,
      serialNumber,  // Not in schema - will be stored in description
      department,  // Not in schema - will be stored in description
      employee,  // Frontend uses employee name - will look up User ObjectId
      technicianName,  // Frontend uses technician name - will look up User ObjectId
      usedByType,
      assignedEmployee,  // ObjectId from frontend
      technician,  // ObjectId from frontend
      maintenanceTeam,  // ObjectId
      assignedDate,
      scrapDate,
      location,
      workCenter,
      status,
      description,
    } = req.body;

    // Validate required fields
    if (!(name || equipmentName) || !(category || equipmentCategory) || !company) {
      return res.status(400).json({ message: 'Name, category, and company are required' });
    }

    // Build description with additional info if provided
    let equipmentDescription = description || '';
    if (serialNumber || department) {
      const additionalInfo = [];
      if (serialNumber) additionalInfo.push(`Serial: ${serialNumber}`);
      if (department) additionalInfo.push(`Department: ${department}`);
      equipmentDescription = additionalInfo.join(' | ') + (equipmentDescription ? ` | ${equipmentDescription}` : '');
    }

    const newEquipment = new Equipment({
      name: name || equipmentName,
      category: category || equipmentCategory,
      company,
      usedByType: usedByType || 'Employee',
      assignedEmployee: assignedEmployee || undefined,  // ObjectId
      technician: technician || undefined,  // ObjectId
      maintenanceTeam: maintenanceTeam || undefined,  // ObjectId
      assignedDate: assignedDate ? new Date(assignedDate) : undefined,
      scrapDate: scrapDate ? new Date(scrapDate) : undefined,
      location: location || undefined,
      workCenter: workCenter || undefined,
      status: status || 'Active',
      description: equipmentDescription || undefined,
    });

    const savedEquipment = await newEquipment.save();
    
    // Populate references for response
    await savedEquipment.populate('assignedEmployee', 'firstName lastName');
    await savedEquipment.populate('technician', 'firstName lastName');
    await savedEquipment.populate('maintenanceTeam', 'teamName');
    
    // Transform response to match frontend expectations
    const transformedEquipment = {
      _id: savedEquipment._id,
      id: savedEquipment._id,
      equipmentName: savedEquipment.name,
      name: savedEquipment.name,
      equipmentCategory: savedEquipment.category,
      category: savedEquipment.category,
      company: savedEquipment.company,
      serialNumber: serialNumber || '',  // Return from request
      department: department || '',  // Return from request
      employee: employee || (savedEquipment.assignedEmployee ? `${savedEquipment.assignedEmployee.firstName || ''} ${savedEquipment.assignedEmployee.lastName || ''}`.trim() : ''),
      technician: technicianName || (savedEquipment.technician ? `${savedEquipment.technician.firstName || ''} ${savedEquipment.technician.lastName || ''}`.trim() : ''),
      technicianName: technicianName || (savedEquipment.technician ? `${savedEquipment.technician.firstName || ''} ${savedEquipment.technician.lastName || ''}`.trim() : ''),
      status: savedEquipment.status,
      description: savedEquipment.description,
      location: savedEquipment.location,
      workCenter: savedEquipment.workCenter,
      assignedEmployee: savedEquipment.assignedEmployee,
      assignedEmployeeId: savedEquipment.assignedEmployee ? savedEquipment.assignedEmployee._id : null,
      technicianId: savedEquipment.technician ? savedEquipment.technician._id : null,
      maintenanceTeam: savedEquipment.maintenanceTeam,
      maintenanceTeamId: savedEquipment.maintenanceTeam ? savedEquipment.maintenanceTeam._id : null,
      usedByType: savedEquipment.usedByType,
      assignedDate: savedEquipment.assignedDate,
      scrapDate: savedEquipment.scrapDate,
      createdAt: savedEquipment.createdAt,
      updatedAt: savedEquipment.updatedAt,
    };
    
    res.status(201).json(transformedEquipment);
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
      .populate('maintenanceTeam', 'teamName')
      .sort({ createdAt: -1 });
    
    // Transform data to match frontend expectations
    const transformedEquipment = equipment.map(eq => {
      // Extract serialNumber and department from description if stored there
      let serialNumber = '';
      let department = '';
      let cleanDescription = eq.description || '';
      
      if (eq.description) {
        const descParts = eq.description.split(' | ');
        const otherParts = [];
        
        descParts.forEach(part => {
          if (part.startsWith('Serial: ')) {
            serialNumber = part.replace('Serial: ', '');
          } else if (part.startsWith('Department: ')) {
            department = part.replace('Department: ', '');
          } else {
            otherParts.push(part);
          }
        });
        
        // Clean description without serial/department
        cleanDescription = otherParts.join(' | ');
      }
      
      return {
        _id: eq._id,
        id: eq._id,
        equipmentName: eq.name,
        name: eq.name,
        equipmentCategory: eq.category,
        category: eq.category,
        company: eq.company,
        serialNumber: serialNumber,
        department: department,
        employee: eq.assignedEmployee ? `${eq.assignedEmployee.firstName || ''} ${eq.assignedEmployee.lastName || ''}`.trim() : '',
        technician: eq.technician ? `${eq.technician.firstName || ''} ${eq.technician.lastName || ''}`.trim() : '',
        technicianName: eq.technician ? `${eq.technician.firstName || ''} ${eq.technician.lastName || ''}`.trim() : '',
        status: eq.status,
        description: cleanDescription,  // Return description without serial/department
        location: eq.location || '',
        workCenter: eq.workCenter || '',
        assignedEmployee: eq.assignedEmployee,
        assignedEmployeeId: eq.assignedEmployee ? eq.assignedEmployee._id : null,
        technicianId: eq.technician ? eq.technician._id : null,
        maintenanceTeam: eq.maintenanceTeam,
        maintenanceTeamId: eq.maintenanceTeam ? eq.maintenanceTeam._id : null,
        usedByType: eq.usedByType,
        assignedDate: eq.assignedDate,
        scrapDate: eq.scrapDate,
        createdAt: eq.createdAt,
        updatedAt: eq.updatedAt,
      };
    });
    
    res.json(transformedEquipment);
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
    
    // Extract serialNumber and department from description if stored there
    let serialNumber = '';
    let department = '';
    let cleanDescription = equipment.description || '';
    
    if (equipment.description) {
      const descParts = equipment.description.split(' | ');
      const otherParts = [];
      
      descParts.forEach(part => {
        if (part.startsWith('Serial: ')) {
          serialNumber = part.replace('Serial: ', '');
        } else if (part.startsWith('Department: ')) {
          department = part.replace('Department: ', '');
        } else {
          otherParts.push(part);
        }
      });
      
      // Clean description without serial/department
      cleanDescription = otherParts.join(' | ');
    }
    
    // Transform data to match frontend expectations
    const transformedEquipment = {
      _id: equipment._id,
      id: equipment._id,
      equipmentName: equipment.name,
      name: equipment.name,
      equipmentCategory: equipment.category,
      category: equipment.category,
      company: equipment.company,
      serialNumber: serialNumber,
      department: department,
      employee: equipment.assignedEmployee ? `${equipment.assignedEmployee.firstName || ''} ${equipment.assignedEmployee.lastName || ''}`.trim() : '',
      technician: equipment.technician ? `${equipment.technician.firstName || ''} ${equipment.technician.lastName || ''}`.trim() : '',
      technicianName: equipment.technician ? `${equipment.technician.firstName || ''} ${equipment.technician.lastName || ''}`.trim() : '',
      status: equipment.status,
      description: cleanDescription,  // Return description without serial/department
      location: equipment.location || '',
      workCenter: equipment.workCenter || '',
      assignedEmployee: equipment.assignedEmployee,
      assignedEmployeeId: equipment.assignedEmployee ? equipment.assignedEmployee._id : null,
      technicianId: equipment.technician ? equipment.technician._id : null,
      maintenanceTeam: equipment.maintenanceTeam,
      maintenanceTeamId: equipment.maintenanceTeam ? equipment.maintenanceTeam._id : null,
      usedByType: equipment.usedByType,
      assignedDate: equipment.assignedDate,
      scrapDate: equipment.scrapDate,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt,
    };
    
    res.json(transformedEquipment);
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
      equipmentName,
      category,
      equipmentCategory,
      company,
      serialNumber,  // Not in schema - will be stored in description
      department,  // Not in schema - will be stored in description
      employee,  // Frontend uses employee name
      technicianName,  // Frontend uses technician name
      usedByType,
      assignedEmployee,  // ObjectId
      technician,  // ObjectId
      maintenanceTeam,  // ObjectId
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

    // Update schema fields
    equipment.name = (name || equipmentName) !== undefined ? (name || equipmentName) : equipment.name;
    equipment.category = (category || equipmentCategory) !== undefined ? (category || equipmentCategory) : equipment.category;
    equipment.company = company !== undefined ? company : equipment.company;
    equipment.usedByType = usedByType !== undefined ? usedByType : equipment.usedByType;
    equipment.assignedEmployee = assignedEmployee !== undefined ? (assignedEmployee || undefined) : equipment.assignedEmployee;
    equipment.technician = technician !== undefined ? (technician || undefined) : equipment.technician;
    equipment.maintenanceTeam = maintenanceTeam !== undefined ? (maintenanceTeam || undefined) : equipment.maintenanceTeam;
    equipment.assignedDate = assignedDate !== undefined ? (assignedDate ? new Date(assignedDate) : undefined) : equipment.assignedDate;
    equipment.scrapDate = scrapDate !== undefined ? (scrapDate ? new Date(scrapDate) : undefined) : equipment.scrapDate;
    equipment.location = location !== undefined ? (location || undefined) : equipment.location;
    equipment.workCenter = workCenter !== undefined ? (workCenter || undefined) : equipment.workCenter;
    equipment.status = status !== undefined ? status : equipment.status;

    // Handle description - merge serialNumber and department if provided
    if (serialNumber !== undefined || department !== undefined || description !== undefined) {
      // Extract existing serial/department and other description parts
      let existingSerial = '';
      let existingDept = '';
      let otherDescParts = [];
      
      if (equipment.description) {
        const descParts = equipment.description.split(' | ');
        descParts.forEach(part => {
          if (part.startsWith('Serial: ')) {
            existingSerial = part.replace('Serial: ', '');
          } else if (part.startsWith('Department: ')) {
            existingDept = part.replace('Department: ', '');
          } else {
            otherDescParts.push(part);
          }
        });
      }
      
      // Use new values or keep existing
      const finalSerial = serialNumber !== undefined ? serialNumber : existingSerial;
      const finalDept = department !== undefined ? department : existingDept;
      
      // If description is provided, use it; otherwise keep existing other parts
      let finalDesc = '';
      if (description !== undefined) {
        finalDesc = description;
      } else {
        finalDesc = otherDescParts.join(' | ');
      }
      
      // Rebuild description with serial and department at the start
      const additionalInfo = [];
      if (finalSerial) additionalInfo.push(`Serial: ${finalSerial}`);
      if (finalDept) additionalInfo.push(`Department: ${finalDept}`);
      
      if (additionalInfo.length > 0) {
        equipment.description = additionalInfo.join(' | ') + (finalDesc ? ` | ${finalDesc}` : '');
      } else {
        equipment.description = finalDesc || undefined;
      }
    }

    const updatedEquipment = await equipment.save();
    
    // Populate references for response
    await updatedEquipment.populate('assignedEmployee', 'firstName lastName');
    await updatedEquipment.populate('technician', 'firstName lastName');
    await updatedEquipment.populate('maintenanceTeam', 'teamName');
    
    // Extract serialNumber and department from description for response
    let responseSerial = '';
    let responseDept = '';
    let cleanDescription = updatedEquipment.description || '';
    
    if (updatedEquipment.description) {
      const descParts = updatedEquipment.description.split(' | ');
      const otherParts = [];
      
      descParts.forEach(part => {
        if (part.startsWith('Serial: ')) {
          responseSerial = part.replace('Serial: ', '');
        } else if (part.startsWith('Department: ')) {
          responseDept = part.replace('Department: ', '');
        } else {
          otherParts.push(part);
        }
      });
      
      // Clean description without serial/department
      cleanDescription = otherParts.join(' | ');
    }
    
    // Transform response to match frontend expectations
    const transformedEquipment = {
      _id: updatedEquipment._id,
      id: updatedEquipment._id,
      equipmentName: updatedEquipment.name,
      name: updatedEquipment.name,
      equipmentCategory: updatedEquipment.category,
      category: updatedEquipment.category,
      company: updatedEquipment.company,
      serialNumber: responseSerial,
      department: responseDept,
      employee: updatedEquipment.assignedEmployee ? `${updatedEquipment.assignedEmployee.firstName || ''} ${updatedEquipment.assignedEmployee.lastName || ''}`.trim() : '',
      technician: updatedEquipment.technician ? `${updatedEquipment.technician.firstName || ''} ${updatedEquipment.technician.lastName || ''}`.trim() : '',
      technicianName: updatedEquipment.technician ? `${updatedEquipment.technician.firstName || ''} ${updatedEquipment.technician.lastName || ''}`.trim() : '',
      status: updatedEquipment.status,
      description: cleanDescription,  // Return description without serial/department
      location: updatedEquipment.location || '',
      workCenter: updatedEquipment.workCenter || '',
      assignedEmployee: updatedEquipment.assignedEmployee,
      assignedEmployeeId: updatedEquipment.assignedEmployee ? updatedEquipment.assignedEmployee._id : null,
      technicianId: updatedEquipment.technician ? updatedEquipment.technician._id : null,
      maintenanceTeam: updatedEquipment.maintenanceTeam,
      maintenanceTeamId: updatedEquipment.maintenanceTeam ? updatedEquipment.maintenanceTeam._id : null,
      usedByType: updatedEquipment.usedByType,
      assignedDate: updatedEquipment.assignedDate,
      scrapDate: updatedEquipment.scrapDate,
      createdAt: updatedEquipment.createdAt,
      updatedAt: updatedEquipment.updatedAt,
    };
    
    res.json(transformedEquipment);
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
