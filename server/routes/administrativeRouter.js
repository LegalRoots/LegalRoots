const express = require("express");

const router = express.Router();
const employeesController = require("../controllers/administrativeControllers/employeesController");
const multer = require("multer");

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage });

router.post(
  "/employees",
  upload.fields([{ name: "photo" }, { name: "idPhoto" }]),
  employeesController.addEmployee
);
router.get("/employees", employeesController.getEmployees);

module.exports = router;
