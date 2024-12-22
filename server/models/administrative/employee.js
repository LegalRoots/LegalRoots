const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  ssid: { type: String, required: true },
  employee_id: { type: String, required: true },
  full_name: { type: String, required: true },
  job: { type: String, required: true },
  gender: { type: String, required: true },
  birthdate: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  court_branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourtBranch",
    required: false,
  },
  employee_photo: Buffer,
  id_photo: Buffer,
  isValid: { type: Boolean, required: true },
});

module.exports = mongoose.model("Employee", employeeSchema);
