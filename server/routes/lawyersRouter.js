const express = require("express");
const lawyersController = require("./../controllers/lawyersController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.get("/", lawyersController.getAllLawyers);
module.exports = router;
