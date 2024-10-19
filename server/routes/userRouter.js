const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/check-email", authController.checkEmail);
router.post("/check-SSID", authController.checkSSID);

module.exports = router;
