const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  required: { type: Boolean, default: false },
});

const caseTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: [fieldSchema],
  isValid: { type: Boolean, default: true },
});

module.exports = mongoose.model("CaseType", caseTypeSchema);
