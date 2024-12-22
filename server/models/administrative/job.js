const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.Mixed,
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: {
      type: permissionSchema,
    },
    isValid: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
