const express = require("express");
const casesController = require("../../controllers/administrativeControllers/casesController");
const router = express.Router();

//create cases
router.post("/caseType", casesController.addCaseType);
router.post("/case", casesController.addCase);
//get cases
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
module.exports = router;
