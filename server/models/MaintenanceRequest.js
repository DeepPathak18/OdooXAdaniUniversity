// models/MaintenanceRequest.js
const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },           // Test activity

    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true                                     // Mitchell Admin
    },

    equipment: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Equipment", 
      required: true                                     // Acer Laptop...
    },

    category: { type: String, required: true },          // Computers

    requestDate: { type: Date, default: Date.now },

    maintenanceType: { 
      type: String, 
      enum: ["Corrective", "Preventive"], 
      required: true 
    },

    team: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "MaintenanceTeam", 
      required: true 
    },

    technician: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"                                        // Aka Foster
    },

    scheduledDate: { type: Date },

    durationHours: { type: Number, default: 0 },

    priority: { 
      type: String, 
      enum: ["Low", "Medium", "High", "Critical"], 
      default: "Medium"
    },

    company: { type: String, required: true },

    status: { 
      type: String, 
      enum: ["New", "In Progress", "Repaired", "Scrap"], 
      default: "New"
    },

    notes: { type: String },

    instructions: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
