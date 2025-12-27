// models/MaintenanceTeam.js
const mongoose = require("mongoose");

const maintenanceTeamSchema = new mongoose.Schema(
  {
    teamName: { type: String, required: true },         // Internal Maintenance, Metrology...

    company: { type: String, required: true },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    leader: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },

    specialty: { type: String }                         // IT, Hardware, Mechanical...
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceTeam", maintenanceTeamSchema);