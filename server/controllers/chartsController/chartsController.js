const mongoose = require("mongoose");
const Case = require("../../models/administrative/case");
const CaseType = require("../../models/administrative/caseType");
const CourtBranch = require("../../models/administrative/courtBranch");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const findTopCaseTypesCounts = async (req, res) => {
  const topCaseTypes = await Case.aggregate([
    { $group: { _id: "$caseType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 12 },
  ]);

  if (!topCaseTypes) {
    res.status(400).json({ message: "no case types found" });
  }

  let idsList = topCaseTypes.map((x) => x._id);
  const names = await CaseType.find({ _id: { $in: idsList } }).select(
    "_id name"
  );

  const response = [];

  for (let i = 0; i < names.length; i++) {
    for (let j = 0; j < topCaseTypes.length; j++) {
      if (String(names[i]._id) === String(topCaseTypes[j]._id)) {
        response.push({ name: names[i].name, count: topCaseTypes[j].count });
        break;
      }
    }
  }

  res.status(200).json({ caseTypes: response });
};

const findTopCourtsCounts = async (req, res) => {
  const topCourts = await Case.aggregate([
    { $group: { _id: "$court_branch", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 12 },
  ]);

  if (!topCourts) {
    res.status(400).json({ message: "no case types found" });
  }

  let idsList = topCourts.map((x) => x._id);

  const names = await CourtBranch.find({ _id: { $in: idsList } }).select(
    "_id name"
  );

  const response = [];

  for (let i = 0; i < names.length; i++) {
    for (let j = 0; j < topCourts.length; j++) {
      if (String(names[i]._id) === String(topCourts[j]._id)) {
        response.push({ name: names[i].name, count: topCourts[j].count });
        break;
      }
    }
  }

  res.status(200).json({ CourtBranches: response });
};

const countCasesStates = async (req, res) => {
  try {
    const activeCaseCount = await Case.countDocuments({ isActive: true });
    const closedCaseCount = await Case.countDocuments({ isClosed: true });
    const assignedCaseCount = await Case.countDocuments({ isAssigned: false });

    res.status(200).json({
      active: activeCaseCount,
      closed: closedCaseCount,
      nonAssigned: assignedCaseCount,
    });
  } catch (err) {
    console.error("Error counting active cases:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

const countCasesStatesForCourtBranch = async (req, res) => {
  const { courtBranchId } = req.params;
  if (!courtBranchId) {
    res.status(400).json({ message: " court id must be provided" });
  }
  try {
    const activeCaseCount = await Case.countDocuments({
      isActive: true,
      court_branch: courtBranchId,
    });
    const closedCaseCount = await Case.countDocuments({
      isClosed: true,
      court_branch: courtBranchId,
    });
    const assignedCaseCount = await Case.countDocuments({
      isAssigned: false,
      court_branch: courtBranchId,
    });

    res.status(200).json({
      active: activeCaseCount,
      closed: closedCaseCount,
      nonAssigned: assignedCaseCount,
    });
  } catch (err) {
    console.error("Error counting active cases:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  findTopCaseTypesCounts,
  findTopCourtsCounts,
  countCasesStates,
  countCasesStatesForCourtBranch,
};
