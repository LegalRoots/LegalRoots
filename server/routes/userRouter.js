const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Configure multer storage to keep file extension
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the upload directory
  },
  filename: function (req, file, cb) {
    // Extract the file extension
    const extname = path.extname(file.originalname);
    // Create a unique filename with the extension
    cb(null, Date.now() + extname);
  },
});

// Set up multer with the custom storage configuration
const upload = multer({ storage: storage });

// Example middleware for a route
router.post(
  "/signup",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "practicing_certificate", maxCount: 1 },
  ]),
  authController.signup
);

router.get("/:userId", userController.getUserBySSID);

router.post("/login", authController.login);
router.put("/updateProfile", userController.updateProfile);
router.post("/check-email", authController.checkEmail);
router.post("/check-SSID", authController.checkSSID);
router.post("/:userId/follow", userController.toggleFollow);
router.delete("/:userId/follow", userController.toggleFollow);

module.exports = router;
