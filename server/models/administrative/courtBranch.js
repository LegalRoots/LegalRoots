const mongoose = require("mongoose");

const courtBranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  city: {
    type: String,
    required: true,
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    // unique: true,
  },
});

const CourtBranch = mongoose.model("CourtBranch", courtBranchSchema);

module.exports = CourtBranch;
