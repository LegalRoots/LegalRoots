const express = require("express");
const witnessContorller = require("../../controllers/administrativeControllers/witnessContorller");

const router = express.Router();
//create a witness
router.post("/witness/create", witnessContorller.createWitness);
router.get("/witness/caseId/:id", witnessContorller.getWitnessByCaseId);
//get witness

//manage the witness

module.exports = router;
