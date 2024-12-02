const mongoose = require("mongoose");

const judgeSchema = new mongoose.Schema({
  ssid: { type: String, required: true },
  judge_id: { type: String, required: true },
  first_name: { type: String, required: true },
  second_name: { type: String, required: true },
  third_name: { type: String, required: true },
  last_name: { type: String, required: true },

  address: { type: { city: String, street: String }, required: true },
  gender: { type: String, required: true },
  birthdate: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  court_type: { type: String, required: true },
  court_name: { type: String, required: true },
  experience: { type: String, required: true },
  qualifications: { type: String, required: true },
  judge_photo: Buffer,
  id_photo: Buffer,
  pp_photo: Buffer,
  isValid: { type: Boolean, required: true },
});

module.exports = mongoose.model("Judge", judgeSchema);
