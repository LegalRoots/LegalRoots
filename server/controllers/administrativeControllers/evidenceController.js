const mongoose = require("mongoose");
const Evidence = require("../../models/administrative/evidence");
const fs = require("fs");
const path = require("path");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const createEvidence = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { case_id, uploaded_by } = req.body;

    // Validate request body
    if (!case_id || !uploaded_by) {
      return res.status(400).json({
        message: "missing some required fields",
      });
    }

    const newEvidence = new Evidence({
      case_id,
      file_type: file.mimetype,
      file_path: file.path,
      uploaded_by,
    });

    const savedEvidence = await newEvidence.save();

    res.status(201).json({
      message: "Evidence created successfully",
      evidence: savedEvidence,
    });
  } catch (error) {
    console.error("Error creating evidence:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvidenceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }

    const evidence = await Evidence.findOne({ _id: id });

    if (!evidence) {
      return res
        .status(404)
        .json({ message: "No evidence found for the given id" });
    }

    res
      .status(200)
      .json({ message: "Evidence retrieved successfully", evidence });
  } catch (error) {
    console.error("Error fetching evidence by id:", error.stack || error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvidencesByCaseId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "case_id is required" });
    }

    const evidences = await Evidence.find({ case_id: id });

    if (!evidences.length) {
      return res
        .status(404)
        .json({ message: "No evidence found for the given case_id" });
    }

    //modify the file path --> file name
    for (var i = 0; i < evidences.length; i += 1) {
      let tmp = evidences[i].file_path.split("-");
      console.log(tmp);
      evidences[i].file_path = tmp[tmp.length - 1];
    }

    res
      .status(200)
      .json({ message: "Evidences retrieved successfully", evidences });
  } catch (error) {
    console.error("Error fetching evidences by case_id:", error.stack || error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvidencesByOwnerId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "case_id is required" });
    }

    const evidences = await Evidence.find({ uploaded_by: id });

    if (!evidences.length) {
      return res
        .status(404)
        .json({ message: "No evidence found for the given user id" });
    }

    res
      .status(200)
      .json({ message: "Evidences retrieved successfully", evidences });
  } catch (error) {
    console.error("Error fetching evidences by id:", error.stack || error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvidenceFileById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "id is required" });
    }
    const evidence = await Evidence.findOne({ _id: id });
    if (!evidence) {
      return res
        .status(404)
        .json({ message: "No evidence found for the given id" });
    }
    let file_path = evidence.file_path;
    console.log(file_path);
    console.log("--------------------------------------------");
    const absolutePath = path.join(__dirname, "../..", file_path);

    console.log(absolutePath);
    fs.access(absolutePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: "File not found" });
      }

      // Example of sending file URL with other data
      res.sendFile(absolutePath, (err) => {
        if (err) {
          res.status(500).send("Error sending file");
        }
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

module.exports = {
  createEvidence,
  getEvidencesByCaseId,
  getEvidenceById,
  getEvidencesByOwnerId,
  getEvidenceFileById,
};
