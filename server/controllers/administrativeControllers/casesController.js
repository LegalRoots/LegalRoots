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

/*
  body:{name: , fields {name,type,required}}
*/
const addCaseType = async (req, res, next) => {
  const { name, fields } = req.body;

  try {
    const newCaseType = new CaseType({ name, fields });
    await newCaseType.save();
    res
      .status(201)
      .json({ message: "Case type created!", caseType: newCaseType });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addCase = async (req, res, next) => {
  const {
    caseType,
    description,
    judges,
    plaintiff,
    defendant,
    plaintiff_lawyers,
    defendant_lawyers,
    court_branch,
    data,
  } = req.body;
  if (!caseType || !plaintiff || !defendant || !court_branch || !data) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    // Fetch the CaseType to validate the fields
    const selectedCaseType = await CaseType.findById(caseType);
    if (!caseType) throw new Error("Case type not found");

    // Validate provided data against the CaseType fields
    const validData = {};
    for (const field of selectedCaseType.fields) {
      if (field.required && !(field.name in data)) {
        throw new Error(`Missing required field: ${field.name}`);
      }
      if (field.type === "Date") {
        validData[field.name] = new Date(data[field.name]);
      } else {
        validData[field.name] = data[field.name];
      }
      //here the datatype is specified
    }

    // Create the new case
    const newCase = new Case({
      caseType,
      description: description || "",
      init_date: new Date(),
      judges: judges || [],
      plaintiff,
      defendant,
      plaintiff_lawyers: plaintiff_lawyers || [],
      defendant_lawyers: defendant_lawyers || [],
      court_branch,
      isActive: false,
      isAssigned: false,
      isClosed: false,
      data: validData,
    });
    await newCase.save();

    LAST_WRITE_TO_CASE = new Date();

    res.status(201).json({ message: "Case created!", case: newCase });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCasesByCaseTypeId = async (req, res) => {
  const { caseTypeId } = req.params;

  try {
    // Validate caseTypeId presence
    if (!caseTypeId) {
      return res.status(400).json({ error: "caseTypeId is required" });
    }

    //   const cases = await Case.find({ caseType: caseTypeId }).populate('caseType');
    const cases = await Case.find({ caseType: caseTypeId });

    if (cases.length === 0) {
      return res
        .status(404)
        .json({ message: "No cases found for this caseTypeId" });
    }

    // Return the found cases
    res.status(200).json({ cases });
    LAST_FETCH_BY_CASETYPEID = new Date();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCases = async (req, res) => {
  const courtId = req.query.court;

  try {
    let filter = {};
    if (courtId && courtId.length === 24) {
      filter.court_branch = courtId;
    }
    let cases = await Case.find(filter).populate([
      { path: "court_branch", select: "name" },
      {
        path: "caseType",
        select: "name",
      },
    ]);

    if (cases.length === 0) {
      return res.status(404).json({ message: "No cases found" });
    }

    // Return the found cases
    res.status(200).json({ cases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCaseTypes = async (req, res) => {
  try {
    // Fetch all cases from the database
    const caseTypes = await CaseType.find({ isValid: true });

    if (caseTypes.length === 0) {
      return res.status(404).json({ message: "No case Types found" });
    }

    // Return the found cases
    res.status(200).json({ caseTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCaseTypeById = async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ message: "case id is required" });
  }
  const id = req.params.id;
  console.log(id);
  try {
    // Fetch all cases from the database
    const caseType = await CaseType.findOne({ _id: id });

    if (caseType.length === 0) {
      return res
        .status(404)
        .json({ message: "No case Type found for the provided id" });
    }

    // Return the found cases
    res.status(200).json({ caseType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCaseById = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate case ID presence
    if (!id) {
      return res.status(400).json({ error: "Case ID is required" });
    }
    const caseData = await Case.findById(id).populate([
      {
        path: "caseType",
        select: "name",
      },
      "court_branch",
    ]);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    // Return the found case
    res.status(200).json({ case: caseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addJudgeByJudgeId = async (req, res) => {
  const { caseId, judgeId } = req.body;

  if (!caseId || !judgeId) {
    return res.status(400).json({ error: "caseId and judgeId are required." });
  }

  try {
    const judge = await Judge.findOne({ judge_id: judgeId }).exec();

    if (!judge) {
      return res.status(404).json({ error: "judge not found." });
    }

    const cc = await Case.findById(caseId).exec();

    if (String(cc.court_branch) !== String(judge.court_name)) {
      return res.status(400).json({ error: "invalid judge" });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $addToSet: { judges: judge._id } },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    res
      .status(200)
      .json({ message: "Judge added successfully.", case: updatedCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add judge to the case." });
  }
};

const addJudge = async (req, res) => {
  const { caseId, judgeId } = req.body;

  if (!caseId || !judgeId) {
    return res.status(400).json({ error: "caseId and judgeId are required." });
  }

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $addToSet: { judges: judgeId } },
      { new: true }
    ).populate("judges");

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    res
      .status(200)
      .json({ message: "Judge added successfully.", case: updatedCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add judge to the case." });
  }
};

const removeJudge = async (req, res) => {
  const { caseId, judgeId } = req.body;

  if (!caseId || !judgeId) {
    return res.status(400).json({ error: "caseId and judgeId are required." });
  }

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $pull: { judges: judgeId } },
      { new: true }
    ).populate("judges");

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found." });
    }

    res
      .status(200)
      .json({ message: "Judge removed successfully.", case: updatedCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove judge from the case." });
  }
};

const getAllJudges = async (req, res) => {
  const { caseId } = req.params;

  if (!caseId) {
    return res.status(400).json({ error: "caseId is required." });
  }

  try {
    const caseData = await Case.findById(caseId).populate("judges");

    if (!caseData) {
      return res.status(404).json({ error: "Case not found." });
    }

    res
      .status(200)
      .json({ count: caseData.judges.length, judges: caseData.judges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve judges." });
  }
};

const deleteCaseType = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCaseType = await CaseType.findByIdAndUpdate(
      id,
      { isValid: false },
      { new: true }
    );

    if (!updatedCaseType) {
      return res.status(404).json({ message: "CaseType not found" });
    }

    res.status(200).json({
      message: "CaseType marked as invalid",
      caseType: updatedCaseType,
    });
  } catch (error) {
    console.error("Error marking CaseType as invalid:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const updateCaseFields = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.body;

    if (!Array.isArray(fields)) {
      return res.status(400).json({ message: "Fields should be an array" });
    }

    const updatedCaseType = await CaseType.findByIdAndUpdate(
      id,
      { fields },
      { new: true, runValidators: true }
    );

    if (!updatedCaseType) {
      return res.status(404).json({ message: "CaseType not found" });
    }

    res.status(200).json({
      message: "CaseType fields updated successfully",
      caseType: updatedCaseType,
    });
  } catch (error) {
    console.error("Error updating CaseType fields:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

exports.addCaseType = addCaseType;
exports.addCase = addCase;
exports.getCasesByCaseTypeId = getCasesByCaseTypeId;
exports.getAllCases = getAllCases;
exports.getCaseById = getCaseById;
exports.getAllCaseTypes = getAllCaseTypes;
exports.getCaseTypeById = getCaseTypeById;
exports.addJudge = addJudge;
exports.removeJudge = removeJudge;
exports.getAllJudges = getAllJudges;
exports.addJudgeByJudgeId = addJudgeByJudgeId;
exports.deleteCaseType = deleteCaseType;
exports.updateCaseFields = updateCaseFields;
