const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const evidenceController = require("../../controllers/administrativeControllers/evidenceController");

const router = express.Router();

//manage the multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/evidences";
    // Ensure upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Use original file name with a timestamp to avoid duplicates
    const uniqueSuffix =
      req.body.case_id +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/json",
    "application/pdf",
    "image/png",
    "image/jpeg",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "audio/mpeg",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

//create an evidence
router.post(
  "/evidence/add",
  upload.single("file"),
  evidenceController.createEvidence
);

router.get("/evidence/caseId/:id", evidenceController.getEvidencesByCaseId);
router.get("/evidence/userId/:id", evidenceController.getEvidencesByOwnerId);
router.get("/evidence/evidenceId/:id", evidenceController.getEvidenceById);
router.get(
  "/evidence/file/evidenceId/:id",
  evidenceController.getEvidenceFileById
);
module.exports = router;
