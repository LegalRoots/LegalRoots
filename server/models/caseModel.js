const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const caseSchema = new mongoose.Schema({
  user: {
    // defendant or plaintiff
    ssid: { type: String, required: true },
  },
  user_type: {
    type: String,
    enum: ["plaintiff", "defendant"],
    required: true,
  },
  case_documents: [
    {
      path: { type: String, required: true },
      extension: { type: String, required: true },
    },
  ],
  tasks: [
    {
      taskId: { type: Number },
      text: { type: String, required: true },
      assignedTo: { type: String, required: true, default: "Client" },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      allDay: { type: Boolean, default: false },
      status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },
      description: { type: String },
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
  lawyer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lawyer",
    },
  ],
  Case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
  },
});

caseSchema.plugin(AutoIncrement, { inc_field: "case_id" });
caseSchema.plugin(AutoIncrement, { inc_field: "tasks.taskId" });

caseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Case = mongoose.model("ClientCase", caseSchema);

module.exports = Case;
