const express = require("express");
const lawyersController = require("./../controllers/lawyersController");
const authController = require("./../controllers/authController");
const router = express.Router();

// Basic CRUD for lawyers
router.get("/", lawyersController.getAllLawyers);
router.get("/recommended", lawyersController.recommendLawyer);
router.get("/specializations", lawyersController.getSpecializations);

router.get("/:id", lawyersController.getLawyerDetails);
router.get("/:id/verify", lawyersController.verifyLawyer);
router.get("/ssid/:ssid", lawyersController.getLawyerBySSID);
router.patch("/:id", lawyersController.updateLawyer);
router.delete("/:id", lawyersController.deleteLawyer);

// Update specific fields
router.get("/:id/reviews", lawyersController.getReviews);
router.patch("/:id/cases", lawyersController.updateCaseStats);
router.post("/:lawyerId/reviews", lawyersController.addClientReview);
router.put("/:id/reviews", lawyersController.updateClientReview);
router.patch("/:id/achievements", lawyersController.addAchievement);

// router.get("/recommend/wonCases", lawyersController.recommendLawyerByWonCases);
// router.get(
//   "/recommend/assessment",
//   lawyersController.recommendLawyerByAssessment
// );

module.exports = router;
