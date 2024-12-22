const express = require("express");
const chartsController = require("../../controllers/chartsController/chartsController");
const router = express.Router();

router.get("/case/caseTypes/count", chartsController.findTopCaseTypesCounts);
router.get("/case/court-branch/count", chartsController.findTopCourtsCounts);

router.get("/case/case-state/count", chartsController.countCasesStates);
router.get(
  "/case/case-state/count/:courtBranchId",
  chartsController.countCasesStatesForCourtBranch
);

module.exports = router;
