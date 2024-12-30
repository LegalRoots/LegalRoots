const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: [
    {
      type: String,
    },
  ],

  createdAt: { type: Date, default: Date.now },
  lastMessage: { type: String },
});

module.exports = mongoose.model("Conversation", ConversationSchema);
