const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./factoryController");
const sendNotification = require("./notificationsController").sendNotification;
const mongoose = require("mongoose");
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
exports.getUserBySSID = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ SSID: req.params.userId });

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({ user });
});
