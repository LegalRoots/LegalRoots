const mongoose = require("mongoose");

const SequenceScehma = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sequenceName: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Sequence = mongoose.model("Sequence", SequenceScehma);

module.exports = Sequence;
