const express = require("express");
const assignedCasesController = require("../../controllers/administrativeControllers/assignedCasesController");
const router = express.Router();

//create cases
router.post("/case/assign", assignedCasesController.createAssignment);

router.get("/case/assigned", assignedCasesController.getAllAssignedCases);
router.get(
  "/case/assigned/employeeId/:id?",
  assignedCasesController.getAssignedCasesByEmployeeId
);

module.exports = router;
