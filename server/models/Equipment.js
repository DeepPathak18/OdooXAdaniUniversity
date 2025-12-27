// models/Equipment.js
const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                // Samsung Monitor 15"
    
    category: { 
      type: String, 
      required: true                                      // Computers, Monitors, Software...
    },

    company: { type: String, required: true },            // My Company (San Francisco)

    usedByType: { 
      type: String, 
      enum: ["Employee", "Department"], 
      required: true 
    },

    assignedEmployee: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"                                         // Abigail Peterson
    },

    technician: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"                                         // Mitchell Admin
    },

    maintenanceTeam: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "MaintenanceTeam"                              // Internal Maintenance
    },

    assignedDate: { type: Date },

    scrapDate: { type: Date },

    location: { type: String },                           // Used in location

    workCenter: { type: String },

    status: { 
      type: String, 
      enum: ["Active", "Under Repair", "Scrapped"], 
      default: "Active" 
    },

    description: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
