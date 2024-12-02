const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");
const { getUserSocketMap } = require("../socketMap");
exports.getNotifications = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("notifications");

  res.status(200).json({
    status: "success",
    data: {
      notifications: user.notifications,
    },
  });
});
exports.sendNotification = async (userId, message, io) => {
  const userSocketMap = getUserSocketMap();
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { notifications: { message } },
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    const socketId = userSocketMap[userId];
    if (socketId) {
      io.to(socketId).emit("newNotification", {
        message,
        createdAt: Date.now(),
      });
    } else {
      console.log(`No socket found for user ${userId}`);
    }
  } catch (err) {
    console.error("Failed to send notification", err);
  }
};
exports.markRead = catchAsync(async (req, res, next) => {
  const { userId, notificationId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const notification = user.notifications.id(notificationId);
    if (!notification) return res.status(404).send("Notification not found");

    notification.read = true;
    await user.save({ validateModifiedOnly: true }); // Validate only modified fields

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error marking notification as read", error });
  }
});
