const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "authorType",
  },
  authorType: {
    type: String,
    enum: ["User", "Lawyer", "Admin", "Judge"],
    required: true,
  },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", MessageSchema);
