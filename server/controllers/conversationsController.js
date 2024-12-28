const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
exports.getUserConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: mongoose.Types.ObjectId(req.params.userId),
    }).populate("participants", "name avatarUrl");
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConversationMessages = async (req, res) => {
  console.log(req.params.conversationId);
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate("sender")
      .sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const { text, senderId } = req.body;
    const newMessage = new Message({
      conversationId: req.params.conversationId,
      sender: senderId,
      text,
    });
    await newMessage.save();

    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: text,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
