const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const caseSchema = new mongoose.Schema({
  caseType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CaseType",
    required: true,
  }, // Reference to CaseType
  description: { type: String, required: false },
  init_date: { type: Date, required: true },
  end_date: { type: Date, required: false },
  judges: [{ type: Schema.Types.ObjectId, ref: "Judge" }],
  plaintiff: { type: String, required: true },
  defendant: { type: String, required: true },
  plaintiff_lawyers: [{ type: String, required: false }],
  defendant_lawyers: [{ type: String, required: false }],
  court_branch: { type: Schema.Types.ObjectId, ref: "CourtBranch" },
  isClosed: { type: Boolean, required: true, default: false },
  isActive: { type: Boolean, required: true, default: false },
  isAssigned: { type: Boolean, required: true, default: false },

  data: { type: Map, of: mongoose.Schema.Types.Mixed }, // Flexible storage for case data
});

module.exports = mongoose.model("Case", caseSchema);
