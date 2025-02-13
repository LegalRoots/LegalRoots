const express = require("express");
const casesController = require("../../controllers/administrativeControllers/casesController");
const casesBController = require("../../controllers/administrativeControllers/casesBController");
const casesFilterController = require("../../controllers/administrativeControllers/filters/casesFilterController");

const router = express.Router();

//create cases
router.post("/caseType", casesController.addCaseType);
router.post("/case", casesController.addCase);
//get cases

router.get("/case/judge/:id?", casesBController.getCasesByJudgeId); //get caseTypes
router.get("/caseType", casesController.getAllCaseTypes); //get caseTypes
router.get("/caseType/:id", casesController.getCaseTypeById); //get caseType by id //write controller
router.get("/case/type/:caseTypeId", casesController.getCasesByCaseTypeId);
router.get("/case/all", casesController.getAllCases);
router.get("/case/caseId/:id", casesController.getCaseById);
//manage cases
/*
    1. add , remove judges.
    2. add courts.
    3. modify plaintiff's lawyer
    4. modify defendent's lawyer
*/
// router.post("/case/judges/add", casesController.addJudge);
router.post("/case/judges/add", casesController.addJudgeByJudgeId);
router.post("/case/judges/remove", casesController.removeJudge);
router.get("/case/judges/:caseId", casesController.getAllJudges);

router.delete("/caseType/:id", casesController.deleteCaseType);

router.put("/caseType/:id", casesController.updateCaseFields);

router.get(
  "/case/plaintiff/:plaintiff",
  casesBController.getCasesByPlaintiffSSID
);
router.get(
  "/case/defendant/:defendant",
  casesBController.getCasesByDefendantSSID
);

//operations for lawyers and users ----------------------------------------------
router.get("/case/user/:plaintiff?", casesBController.getCasesByPlaintiffSSID);
router.get("/case/user/:defendant?", casesBController.getCasesByDefendantSSID);

router.get(
  "/case/lawyer/plain/:ssid?",
  casesBController.getCasesByPlaintiffLawyerSSID
);
router.get(
  "/case/lawyer/def/:ssid?",
  casesBController.getCasesByDefendantLawyerSSID
);

//add and delete from plaintiff lawyers
router.post(
  "/case/lawyer/plain/add",
  casesBController.addLawyerToPlaintiffLawyers
);
router.post(
  "/case/lawyer/plain/remove",
  casesBController.removeLawyerFromPlaintiffLawyers
);

//add and delete from defendant lawyers
router.post(
  "/case/lawyer/def/add",
  casesBController.addLawyerToDenedantLawyers
);
router.post(
  "/case/lawyer/def/remove",
  casesBController.removeLawyerFromDefendantLawyers
);

//close the case
router.patch("/case/close/:id?", casesController.closeCase);

//filters -------------------------------------------------------
router.post("/case/filter", casesFilterController.getFilteredCases);
router.get("/case/filter/:id?", casesFilterController.getCasesByPartialId);
module.exports = router;
