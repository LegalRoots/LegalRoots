const CaseType = require("../../../models/administrative/caseType");
const Case = require("../../../models/administrative/case");
const Judge = require("../../../models/administrative/Judge");
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const getFilteredCases = async (req, res) => {
  const courtId = req.query.court;
  try {
    const { court_branch, caseType, caseState, from, to } = req.body;

    // Create a filter object
    const filter = {};

    if (court_branch) {
      filter.court_branch = court_branch;
    }
    if (caseType) {
      filter.caseType = caseType;
    }
    if (caseState) {
      if (caseState === "closed") {
        filter.isClosed = true;
      } else if (caseState === "ongoing") {
        filter.isActive = true;
      } else if (caseState === "non-assigned") {
        filter.isAssigned = false;
      }
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) {
        filter.init_date.$gte = new Date(from);
      }
      if (to) {
        filter.init_date.$lte = new Date(to);
      }
    }

    if (courtId && courtId.length === 24) {
      filter.court_branch = courtId;
    }

    // Fetch cases based on the filter
    const cases = await Case.find(filter).populate([
      { path: "court_branch", select: "name" },
      {
        path: "caseType",
        select: "name",
      },
    ]);

    res.status(200).json({ cases });
  } catch (error) {
    console.error("Error fetching filtered cases:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCasesByPartialId = async (req, res) => {
  try {
    const { id } = req.params; // Assume the partial string comes from the request body
    const courtId = req.query.court;

    if (!id || id === "") {
      let filter = {};
      if (courtId && courtId.length === 24) {
        filter.court_branch = courtId;
      }
      const cases = await Case.find(filter).populate([
        { path: "court_branch", select: "name" },
        {
          path: "caseType",
          select: "name",
        },
      ]);

      return res.status(200).json({ cases });
    }

    let cases = await Case.find({
      $expr: {
        $regexMatch: {
          input: { $toString: "$_id" }, // Convert _id to a string
          regex: id, // Partial match for id
          options: "i", // Case-insensitive search
        },
      },
    }).populate([
      { path: "court_branch", select: "name" },
      {
        path: "caseType",
        select: "name",
      },
    ]);

    console.log(cases);
    if (courtId && courtId.length === 24) {
      cases = cases.filter((c) => c.court_branch.id === courtId);
    }

    res.status(200).json({ cases });
  } catch (error) {
    console.error("Error fetching cases by partial ID:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { getFilteredCases, getCasesByPartialId };
