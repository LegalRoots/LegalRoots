const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const { getUserSocketMap } = require("../socketMap");

const getModel = (userType) => {
  try {
    return mongoose.model(userType);
  } catch (err) {
    throw new Error(`Model ${userType} not found`);
  }
};

exports.getNotifications = catchAsync(async (req, res, next) => {
  console.log("HLELOO");
  const { id, userType } = req.params;
  const Model = getModel(userType);

  const user = await Model.findById(id).select("notifications");

  if (!user) return res.status(404).send(`${userType} not found`);

  res.status(200).json({
    status: "success",
    data: {
      notifications: user.notifications,
    },
  });
});

// Send a notification
exports.sendNotification = async (userId, userType, message, io) => {
  const Model = getModel(userType);
  const userSocketMap = getUserSocketMap();

  try {
    const user = await Model.findByIdAndUpdate(
      userId,
      { $push: { notifications: { message } } },
      { new: true }
    );

    if (!user) {
      throw new Error(`${userType} not found`);
    }

    const socketId = userSocketMap[userId];
    if (socketId) {
      io.to(socketId).emit("newNotification", {
        _id: user.notifications[user.notifications.length - 1]._id,
        message,
        createdAt: Date.now(),
      });
    } else {
      console.log(`No socket found for ${userType} ${userId}`);
    }
  } catch (err) {
    console.error(`Failed to send notification to ${userType}`, err);
  }
};

// Mark notification as read
exports.markRead = catchAsync(async (req, res, next) => {
  const { userId, userType, notificationId } = req.params;
  const Model = getModel(userType);

  try {
    const user = await Model.findById(userId);
    if (!user) return res.status(404).send(`${userType} not found`);

    const notification = user.notifications.id(notificationId);
    if (!notification) return res.status(404).send("Notification not found");

    notification.read = true;
    await user.save({ validateModifiedOnly: true });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error marking notification as read`, error });
  }
});
