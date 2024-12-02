const express = require("express");

const router = express.Router();
const employeesController = require("../controllers/administrativeControllers/employeesController");
const judgesController = require("../controllers/administrativeControllers/judgesController");

const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/employees",
  upload.fields([{ name: "photo" }, { name: "idPhoto" }]),
  employeesController.addEmployee
);
router.get("/employees", employeesController.getEmployees);

router.post(
  "/judges",
  upload.fields([{ name: "photo" }, { name: "idPhoto" }, { name: "ppPhoto" }]),
  judgesController.addJudge
);
router.get("/judges", judgesController.getJudges);
router.get("/judges/:id", judgesController.getJudgeById);

module.exports = router;
