const express = require("express");
const jobsController = require("../../controllers/administrativeControllers/jobsController");
const router = express.Router();

router.post("/job", jobsController.createJob);
router.get("/job", jobsController.getAllJobs);
router.get("/job/:id?", jobsController.getJobById);

router.put("/job/:id?", jobsController.updateJob);
router.delete("/job/:id?", jobsController.deleteJob);
module.exports = router;
