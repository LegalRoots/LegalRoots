const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PermissionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

const CourtSchema = new mongoose.Schema(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    meeting_id: {
      type: String,
      unique: false,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    hasStarted: {
      type: Boolean,
      required: true,
      default: false,
    },
    hasFinished: {
      type: Boolean,
      required: true,
      default: false,
    },
    time: {
      type: Date,
      required: true,
    },
    initiator: {
      type: Schema.Types.ObjectId,
      ref: "Judge",
      required: true,
    },
    admins: {
      type: [{ type: String }],
      required: true,
    },
    guests: {
      type: [String],
      required: true,
    },
    permissions: {
      type: [PermissionSchema],
      required: true,
    },
    decision: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Court = mongoose.model("Court", CourtSchema);

module.exports = Court;
