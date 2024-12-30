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
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate("author", "_id first_name last_name")
      .lean()
      .sort({ timestamp: 1 });
    const transformedMessages = messages.map((message) => {
      if (message.author) {
        Object.assign(message.author, { id: message.author._id });
        Object.assign(message.author, {
          name: `${message.author.first_name} ${message.author.last_name}`,
        });
      }
      return message;
    });

    res.json(transformedMessages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, author, authorType } = req.body;

    const newMessage = new Message({
      conversationId: req.params.conversationId,
      author: author._id,
      authorType,
      text,
    });

    await newMessage.save();

    await Conversation.findByIdAndUpdate(req.params.conversationId, {
      lastMessage: text,
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};
exports.createConversation = async (req, res) => {
  try {
    const { participants, type } = req.body;
    const Conv = await Conversation.findOne({
      participants: { $all: participants.map((p) => p) },
    });

    if (Conv) {
      return res.status(200).json(Conv);
    }

    const newConversation = new Conversation({
      participants: participants.map((p) => p),
      type,
    });

    await newConversation.save({ validateBeforeSave: false });
    res.status(201).json(newConversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};
