const express = require("express");
const router = express.Router();
const casesController = require("./../controllers/casesController");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${req.params.id}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

router.post(
  "/:id/documents",
  upload.single("file"),
  casesController.uploadDocument
);

module.exports = router;

router.get("/", casesController.getAllCases);
router.post("/assignLawyer", casesController.assignLawyer);

router.get("/user/:id", casesController.getUserCases);
router.get("/user/:id/all", casesController.getAllUserCases);
router.get("/lawyer/:id", casesController.getLawyerCases);
router.post("/assign-lawyer/:lawyerId", casesController.assignLawyer);
router.put("/assignments/:id", casesController.updateAssignment);
router.get(
  "/assignments/pending/:lawyerId",
  casesController.getPendingAssignments
);
router.get("/:id", casesController.getCase);
router.put("/:id", casesController.updateCase);
router.post("/tasks/:caseId", casesController.addTask);
router.delete("/:caseId/tasks/:taskId", casesController.deleteTask);
router.put("/:caseId/tasks/:taskId", casesController.updateTask);
router.delete("/:id", casesController.deleteCase);
router.post("/:id/notes", casesController.addNote);
router.post("/", casesController.addCase);
router.post("/markDone", casesController.markDone);

module.exports = router;
