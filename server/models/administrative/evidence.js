const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EvidenceSchema = new mongoose.Schema(
  {
    case_id: {
      type: Schema.Types.ObjectId, // or Schema.Types.ObjectId if referencing a Case model
      ref: "Case",
      required: true,
    },
    file_type: {
      type: String,
      required: true,
      //   enum: ["pdf", "png", "jpg", "video", "audio", "json", "xml", "excel"],
    },
    file_path: {
      type: String,
      required: true,
    },
    uploaded_by: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Evidence = mongoose.model("Evidence", EvidenceSchema);

module.exports = Evidence;
