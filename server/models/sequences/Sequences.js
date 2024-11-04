const mongoose = require("mongoose");

const SequenceScehma = new mongoose.Schema({
  _id: String, //name of sequence
  sequenceValue: Number, // Current sequence value
});

const Sequence = mongoose.model("Sequence", SequenceScehma);

module.exports = Sequence;
