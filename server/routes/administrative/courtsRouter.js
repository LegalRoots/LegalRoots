const express = require("express");
const courtsController = require("../../controllers/administrativeControllers/courtsController");

const router = express.Router();
//create a court
router.post("/court/create", courtsController.createCourt);
//get courts
router.get("/court/all", courtsController.getAllCourts);
router.get("/court/courtId/:id?", courtsController.getCourtById);
router.get("/court/judgeId/:id", courtsController.getCourtsByJudgeId);
router.get("/court/guestId/:id", courtsController.getCourtsByGuestId);
router.get("/court/caseId/:caseId", courtsController.getCourtsByCaseId);

//authorization
router.post("/court/meeting/:id?", courtsController.validateGuest);
router.post("/court/action/auth/:id?", courtsController.validateAction);
router.put("/court/action/manage/:id?", courtsController.manageAction);

//get full court details by id.
router.get(
  "/court/details/:courtId?",
  courtsController.getCourtDetailsByCourtId
);
//manage the court
router.post("/court/meeting_id", courtsController.setMeetingId);
router.get("/court/meeting_id/:id", courtsController.getMeetingId);

router.delete("/court/:id", courtsController.deleteCourt);
router.put("/court/:id", courtsController.replaceCourt);

//filters
router.get("/court/filter", courtsController.getCourtsByDate);

module.exports = router;
