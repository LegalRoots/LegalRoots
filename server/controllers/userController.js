const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./factoryController");
const sendNotification = require("./notificationsController").sendNotification;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

exports.toggleFollow = catchAsync(async (req, res, next) => {
  const io = req.app.get("io");

  const { userId } = req.body;
  const targetUserId = req.params.userId;

  const targetUser = await User.findById(targetUserId);
  const user = await User.findById(userId);

  if (!targetUser || !user) {
    return res.status(404).json({ message: "User not found." });
  }

  const isFollowing = user.following.includes(targetUserId);
  if (isFollowing) {
    await User.findByIdAndUpdate(userId, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: userId },
    });
  } else {
    sendNotification(
      targetUserId,
      "User",
      `${user.first_name} is now following you.`,
      io
    );
    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: userId },
    });
  }

  const updatedUser = await User.findById(userId).populate(
    "following followers"
  );

  return res.status(200).json({ isFollowing: !isFollowing, user: updatedUser });
});
exports.updateProfile = catchAsync(async (req, res, next) => {
  const io = req.app.get("io");
  console.log(req.body);
  const user = await User.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  io.emit("updateProfile", user);
  res.status(200).json({ message: "Profile updated successfully.", user });
});
