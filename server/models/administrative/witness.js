const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WitnessSchema = new mongoose.Schema(
  {
    case_id: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Witness = mongoose.model("Witness", WitnessSchema);

module.exports = Witness;
