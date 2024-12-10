const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Example middleware for a route
router.post(
  "/signup",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "practicing_certificate", maxCount: 1 },
  ]),
  authController.signup
);
// router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.put("/updateProfile", userController.updateProfile);
router.post("/check-email", authController.checkEmail);
router.post("/check-SSID", authController.checkSSID);
router.post("/:userId/follow", userController.toggleFollow);
router.delete("/:userId/follow", userController.toggleFollow);

module.exports = router;
