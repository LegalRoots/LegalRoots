const mongoose = require("mongoose");
const CaseType = require("../../models/administrative/caseType");
const Case = require("../../models/administrative/case");
const Judge = require("../../models/administrative/Judge");
const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const getCasesByPlaintiffSSID = async (req, res) => {
  const { plaintiff } = req.params;

  if (!plaintiff) {
    return res.status(400).json({ message: "plaintiff ssid is required" });
  }

  try {
    const cases = await Case.find({ plaintiff }).populate([
      {
        path: "caseType",
        select: "name",
      },
      "court_branch",
      {
        path: "judges",
        select: "-password -judge_photo -pp_photo -id_photo",
      },
    ]);

    if (!cases.length) {
      return res
        .status(404)
        .json({ message: "No cases found for the specified plaintiff." });
    }

    res.status(200).json({ count: cases.length, cases });
  } catch (error) {
    console.error("Error fetching cases by plaintiff:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving cases." });
  }
};

const getCasesByDefendantSSID = async (req, res) => {
  const { defendant } = req.params;

  if (!defendant) {
    return res.status(400).json({ message: "plaintiff ssid is required" });
  }

  try {
    const cases = await Case.find({ defendant }).populate([
      {
        path: "caseType",
        select: "name",
      },
      "court_branch",
      {
        path: "judges",
        select: "-password -judge_photo -pp_photo -id_photo",
      },
    ]);

    if (!cases.length) {
      return res
        .status(404)
        .json({ message: "No cases found for the specified defendant." });
    }

    res.status(200).json({ count: cases.length, cases });
  } catch (error) {
    console.error("Error fetching cases by defendant:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving cases." });
  }
};

const getCasesByPlaintiffLawyerSSID = async (req, res) => {
  const { ssid } = req.params;

  if (!ssid) {
    return res.status(400).json({ message: "lawyer ssid is required" });
  }

  try {
    const cases = await Case.find({ plaintiff_lawyers: ssid }).populate([
      {
        path: "caseType",
        select: "name",
      },
      "court_branch",
      {
        path: "judges",
        select: "-password -judge_photo -pp_photo -id_photo",
      },
    ]);

    if (!cases.length) {
      return res
        .status(404)
        .json({ message: "No cases found for the specified lawyer SSID." });
    }

    res.status(200).json({ count: cases.length, cases });
  } catch (error) {
    console.error("Error fetching cases by lawyer SSID:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving cases." });
  }
};

const getCasesByDefendantLawyerSSID = async (req, res) => {
  const { ssid } = req.params;

  if (!ssid) {
    return res.status(400).json({ message: "lawyer ssid is required" });
  }

  try {
    const cases = await Case.find({ defendant_lawyers: ssid }).populate([
      {
        path: "caseType",
        select: "name",
      },
      "court_branch",
      {
        path: "judges",
        select: "-password -judge_photo -pp_photo -id_photo",
      },
    ]);

    if (!cases.length) {
      return res
        .status(404)
        .json({ message: "No cases found for the specified lawyer SSID." });
    }

    res.status(200).json({ count: cases.length, cases });
  } catch (error) {
    console.error("Error fetching cases by lawyer SSID:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving cases." });
  }
};

const addLawyerToPlaintiffLawyers = async (req, res) => {
  const { caseId, lawyerSSID } = req.body;

  if (!caseId || !lawyerSSID) {
    return res.status(400).json({ message: "missing required fields" });
  }

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $addToSet: { plaintiff_lawyers: lawyerSSID } },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    res.status(200).json({
      message: "lawyer SSID added to plaintiff lawyers.",
      updatedCase,
    });
  } catch (error) {
    console.error("Error adding lawyer SSID to plaintiff lawyers:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the case." });
  }
};

const addLawyerToDenedantLawyers = async (req, res) => {
  const { caseId, lawyerSSID } = req.body;

  if (!caseId || !lawyerSSID) {
    return res.status(400).json({ message: "missing required fields" });
  }

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $addToSet: { defendant_lawyers: lawyerSSID } },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    res.status(200).json({
      message: "lawyer SSID added to defendant lawyers.",
      updatedCase,
    });
  } catch (error) {
    console.error("Error adding lawyer SSID to defendant lawyers:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the case." });
  }
};

const removeLawyerFromPlaintiffLawyers = async (req, res) => {
  const { caseId, lawyerSSID } = req.body;

  if (!caseId || !lawyerSSID) {
    return res.status(400).json({ message: "missing required fields" });
  }

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $pull: { plaintiff_lawyers: lawyerSSID } },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    res.status(200).json({
      message: "Lawyer SSID removed from plaintiff lawyers.",
      updatedCase,
    });
  } catch (error) {
    console.error("Error removing lawyer SSID from plaintiff lawyers:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the case." });
  }
};

const removeLawyerFromDefendantLawyers = async (req, res) => {
  const { caseId, lawyerSSID } = req.body;

  if (!caseId || !lawyerSSID) {
    return res.status(400).json({ message: "missing required fields" });
  }

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $pull: { defendant_lawyers: lawyerSSID } },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found." });
    }

    res.status(200).json({
      message: "Lawyer SSID removed from plaintiff lawyers.",
      updatedCase,
    });
  } catch (error) {
    console.error("Error removing lawyer SSID from plaintiff lawyers:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the case." });
  }
};

module.exports = {
  getCasesByPlaintiffSSID,
  getCasesByDefendantSSID,
  getCasesByPlaintiffLawyerSSID,
  getCasesByDefendantLawyerSSID,
  addLawyerToPlaintiffLawyers,
  addLawyerToDenedantLawyers,
  removeLawyerFromPlaintiffLawyers,
  removeLawyerFromDefendantLawyers,
};
