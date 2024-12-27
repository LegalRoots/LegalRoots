const express = require("express");
const courtBranchController = require("../../controllers/administrativeControllers/courtBranchController");
const router = express.Router();

router.post("/court-branch", courtBranchController.createCourtBranch);
router.put("/court-branch/:id?", courtBranchController.updateCourtBranch);

router.get("/court-branch", courtBranchController.getAllCourtBranches);
router.get("/court-branch/:id", courtBranchController.getCourtBranchById);

module.exports = router;
