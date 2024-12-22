const express = require("express");
const lawyersController = require("./../controllers/lawyersController");
const authController = require("./../controllers/authController");
const router = express.Router();

// Basic CRUD for lawyers
router.get("/", lawyersController.getAllLawyers);

router.get("/:id", lawyersController.getLawyerDetails);
router.patch("/:id", lawyersController.updateLawyer);
router.delete("/:id", lawyersController.deleteLawyer);

// Update specific fields
router.get("/:id/reviews", lawyersController.getReviews);
router.patch("/:id/cases", lawyersController.updateCaseStats);
router.post("/:lawyerId/reviews", lawyersController.addClientReview);
router.put("/:id/reviews", lawyersController.updateClientReview);
router.patch("/:id/achievements", lawyersController.addAchievement);

// router.get("/recommend", lawyersController.recommendLawyer);
// router.get("/recommend/wonCases", lawyersController.recommendLawyerByWonCases);
// router.get(
//   "/recommend/assessment",
//   lawyersController.recommendLawyerByAssessment
// );

module.exports = router;
