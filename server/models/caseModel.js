const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const caseSchema = new mongoose.Schema({
  case_title: {
    type: String,
    required: [true, "Case title is required!"],
  },
  case_description: {
    type: String,
    required: [true, "Case description is required!"],
  },
  case_type: {
    type: String,
    required: [true, "Case type is required!"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required!"],
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Closed", "Resolved"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  court_date: {
    type: Date,
  },
  case_documents: [
    {
      path: { type: String, required: true },
      extension: { type: String, required: true },
    },
  ],
  notes: [
    {
      note: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  notifications: [
    {
      message: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
  lawyer: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer" },
});

caseSchema.plugin(AutoIncrement, { inc_field: "case_id" });

caseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Case = mongoose.model("Case", caseSchema);

module.exports = Case;
