const mongoose = require("mongoose");

const assignedCasesSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Case",
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  isValid: {
    type: Boolean,
    required: true,
    default: true,
  },
  disable_date: {
    type: Date,
    default: null,
  },
  add_date: {
    type: Date,
    required: true,
  },
});

const AssignedCases = mongoose.model("AssignedCases", assignedCasesSchema);

module.exports = AssignedCases;
