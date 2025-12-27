// models/WorkCenter.js
const mongoose = require("mongoose");

const workCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                    // Assembly 1, Drill 1...
    
    code: { type: String, required: true, unique: true },      // ASM-001, DRL-001...
    
    tag: { type: String },                                     // Production, Machining, Fabrication...
    
    alternativeWorkcenter: { type: String },                   // Alternative work center name
    
    costPerHour: { type: Number, default: 0 },                 // Cost per hour
    
    capacity: { type: Number, default: 100 },                  // Capacity percentage
    
    timeEfficiency: { type: Number, default: 100 },            // Time efficiency percentage
    
    oeeTarget: { type: Number, default: 85 },                  // OEE (Overall Equipment Effectiveness) Target
    
    company: { type: String, required: true }                  // Company name
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkCenter", workCenterSchema);

