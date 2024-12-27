const Case = require("../models/caseModel");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const User = require("../models/userModel");
const Lawyer = require("../models/lawyerModel");
const path = require("path");
const { assign } = require("nodemailer/lib/shared");
const { send } = require("process");
const sendNotification = require("./notificationsController").sendNotification;
exports.getAllCases = async (req, res, next) => {
  const cases = await Case.find().exec();
  res.json(cases);
};
exports.addCase = async (req, res, next) => {
  const { case_title, case_type, case_description, court_date } = req.body;
  const { userId } = req.query;
  console.log(userId);
  const newCase = new Case({
    case_title,
    case_type,
    case_description,
    court_date,
    user: userId,
  });
  const savedCase = await newCase.save();
  res.json(savedCase);
};
exports.markDone = async (req, res, next) => {
  const { caseId } = req.body;
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { status: "Resolved" },
      { new: true }
    )
      .populate("lawyer", "first_name last_name")
      .populate("user", "first_name last_name email");

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(updatedCase);
  } catch (error) {
    console.error("Error marking case as resolved:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCase = async (req, res, next) => {
  const { id } = req.params;
  try {
    const caseData = await Case.findById(id)
      .populate("user", "name email")

      .populate("lawyer")
      .populate("notes.addedBy", "first_name last_name email")
      .populate({
        path: "Case",
        populate: [
          { path: "caseType" },
          {
            path: "court_branch",
            populate: { path: "admin", select: "full_name" },
          },
          {
            path: "judges",
            populate: { path: "court_name", select: "full_name" },
          },
          { path: "plaintiff" },
          { path: "defendant" },
          { path: "defendant_lawyers" },
          { path: "plaintiff_lawyers" },
        ],
      })
      .exec();

    res.json(caseData);
  } catch (error) {
    console.error("Error fetching case data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const caseData = await Case.findById(id);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found!" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const fileExtension = path.extname(req.file.originalname);

    caseData.case_documents.push({
      path: `${req.file.path}`,
      extension: fileExtension,
    });
    await caseData.save({ validateModifiedOnly: true });
    res.status(200).json({
      message: "Document uploaded successfully!",
      case: caseData,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res
      .status(500)
      .json({ message: "Failed to upload document", error: error.message });
  }
};

exports.addNote = async (req, res, next) => {
  const { id } = req.params;
  const { note } = req.body;
  const { user } = req.body;
  const newNote = {
    note,
    addedBy: user,
  };
  const updatedCase = await Case.findByIdAndUpdate(
    id,
    { $push: { notes: newNote } },
    { new: true }
  );
  sendNotification(
    updatedCase.user,
    "User",
    `New note added to case: ${updatedCase.case_title}`,
    req.app.get("io")
  );
  res.json(updatedCase);
};
exports.deleteCase = async (req, res, next) => {
  const { id } = req.params;
  await Case.findByIdAndDelete(id);
  res.json({ message: "Case deleted successfully!" });
};
exports.getUserDefendantCases = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cases = await Case.find({ user: id, user_type: "defendant" })
      .populate("lawyer", "first_name last_name")
      .populate({
        path: "Case",
        populate: [
          { path: "caseType" },
          { path: "court_branch" },
          { path: "judges" },
          { path: "plaintiff" },
          { path: "defendant" },
          { path: "defendant_lawyers" },
          { path: "plaintiff_lawyers" },
        ],
      })
      .populate("user")

      .populate("notes.addedBy", "first_name last_name email")
      .exec();
    res.json(cases);
  } catch (error) {
    console.error("Error fetching user cases:", error);

    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserPlaintiffCases = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cases = await Case.find({ user: id, user_type: "plaintiff" })
      .populate("lawyer", "first_name last_name")

      .populate({
        path: "Case",
        populate: [
          { path: "caseType" },
          {
            path: "court_branch",
            populate: { path: "admin", select: "full_name" },
          },
          { path: "judges" },
          { path: "plaintiff" },
          { path: "defendant" },
          { path: "defendant_lawyers" },
          { path: "plaintiff_lawyers" },
        ],
      })

      .populate("notes.addedBy", "first_name last_name email")
      .populate("lawyer")
      .exec();
    console.log(cases);

    res.json(cases);
  } catch (error) {
    console.error("Error fetching user cases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllUserCases = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cases = await Case.find({ user: id })
      .populate({
        path: "Case",
        populate: [
          { path: "caseType" },
          {
            path: "court_branch",
            populate: { path: "admin", select: "full_name" },
          },
          { path: "judges" },
          { path: "plaintiff" },
          { path: "defendant" },
          { path: "defendant_lawyers" },
          { path: "plaintiff_lawyers" },
        ],
      })
      .exec();
    res.json(cases);
  } catch (error) {
    console.error("Error fetching user cases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLawyerDefendantCases = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cases = await Case.find({ lawyer: id, user_type: "defendant" })
      .populate("lawyer", "first_name last_name")
      .populate({
        path: "Case",
        populate: [
          { path: "caseType" },
          {
            path: "court_branch",
            populate: { path: "admin", select: "full_name" },
          },
          { path: "judges" },
          { path: "plaintiff" },
          { path: "defendant" },
          { path: "defendant_lawyers" },
          { path: "plaintiff_lawyers" },
        ],
      })
      .exec();
    res.json(cases);
  } catch (error) {
    console.error("Error fetching lawyer cases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getLawyerPlaintiffCases = async (req, res, next) => {
  const { id } = req.params;
  try {
    const cases = await Case.find({ lawyer: id, user_type: "plaintiff" })
      .populate("lawyer", "first_name last_name")
      .populate({
        path: "Case",
        populate: [
          { path: "caseType" },
          {
            path: "court_branch",
            populate: { path: "admin", select: "full_name" },
          },
          { path: "judges" },
          { path: "plaintiff" },
          { path: "defendant" },
          { path: "defendant_lawyers" },
          { path: "plaintiff_lawyers" },
        ],
      })
      .exec();
    res.json(cases);
  } catch (error) {
    console.error("Error fetching lawyer cases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.assignLawyer = async (req, res) => {
  const { lawyerId, caseId } = req.body;

  try {
    const CASE = await Case.findById(caseId).populate("lawyer");
    if (CASE.lawyer.some((lawyer) => lawyer._id.toString() === lawyerId)) {
      return res.status(400).json({
        message: "Lawyer already assigned to this case",
      });
    }

    const lawyer = await Lawyer.findById(lawyerId).select("-passwordConfirm");
    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    const clientId = req.body.user;
    const existingAssignment = lawyer.assignments.find((assignment) => {
      return (
        assignment.caseId.toString() === caseId &&
        assignment.clientId.toString() === clientId &&
        assignment.status === "Pending"
      );
    });

    if (existingAssignment) {
      return res.status(400).json({
        message:
          "You already have a pending request with this lawyer for the selected case.",
      });
    }

    lawyer.assignments.push({ clientId, caseId });

    const user = await User.findById(clientId);

    sendNotification(
      clientId,
      "User",
      `Assignment request sent to lawyer: ${lawyer.first_name} ${lawyer.last_name}`,
      req.app.get("io")
    );
    sendNotification(
      lawyer._id,
      "Lawyer",
      `New assignment request from client: ${user.first_name} ${user.last_name}`,
      req.app.get("io")
    );

    await lawyer.save();

    return res.status(201).json({
      message: "Assignment request sent successfully!",
    });
  } catch (error) {
    console.error("Error assigning lawyer:", error);

    return res.status(500).json({
      message: "An error occurred while assigning the lawyer.",
      error,
    });
  }
};

exports.confirmLawyerAssignment = async (req, res) => {
  const { lawyerId, assignmentId } = req.params;
  const { status } = req.body;

  const lawyer = await Lawyer.findById(lawyerId);
  if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });

  const assignment = lawyer.assignments.id(assignmentId);
  if (!assignment)
    return res.status(404).json({ message: "Assignment not found" });

  assignment.status = status;
  assignment.updatedAt = new Date();
  await lawyer.save();

  return res.status(200).json({ message: "Assignment updated successfully!" });
};
exports.getPendingAssignments = async (req, res) => {
  const { lawyerId } = req.params;

  try {
    const lawyer = await Lawyer.findById(lawyerId)
      .select("assignments")
      .populate("assignments.clientId", "first_name last_name email")
      .populate({
        path: "assignments.caseId",
        populate: {
          path: "Case",
          populate: [
            { path: "caseType" },
            {
              path: "court_branch",
              populate: { path: "admin", select: "full_name" },
            },
            { path: "judges" },
            { path: "plaintiff" },
            { path: "defendant" },
            { path: "defendant_lawyers" },
            { path: "plaintiff_lawyers" },
          ],
        },
      });

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    const pendingAssignments = lawyer.assignments.filter(
      (assignment) => assignment.status === "Pending"
    );

    return res.status(200).json(pendingAssignments);
  } catch (error) {
    console.error("Error fetching pending assignments:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch pending assignments" });
  }
};
exports.updateAssignment = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedAssignment = await Lawyer.findOneAndUpdate(
    { "assignments._id": id },
    { $set: { "assignments.$.status": status } },
    { new: true }
  );

  if (status === "Denied") {
    return res.json(updatedAssignment);
  }

  const updatedCase = await Case.findByIdAndUpdate(
    updatedAssignment.assignments.id(id).caseId,
    {
      lawyer: status === "Accepted" ? updatedAssignment._id : null,
    },
    { new: true }
  ).populate("Case");

  if (updatedCase.user_type === "plaintiff") {
    updatedCase.Case.plaintiff_lawyers.push(updatedAssignment.SSID);
  } else {
    updatedCase.Case.defendant_lawyers.push(updatedAssignment.SSID);
  }
  await updatedCase.lawyer.push(updatedAssignment._id);
  updatedCase.Case.save({
    validateBeforeSave: false,
  });

  const lawyer = await Lawyer.findById(updatedAssignment._id);
  lawyer.ongoingCases += 1;
  lawyer.save();

  sendNotification(
    updatedAssignment.assignments.id(id).clientId,
    "User",
    `Assignment request ${status.toLowerCase()} by lawyer ${
      updatedAssignment.first_name
    } ${updatedAssignment.last_name}`,
    req.app.get("io")
  );

  res.json(updatedAssignment);
};
exports.updateTask = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { id, text, startDate, endDate, assignTo, status, allDay } = req.body;
    const updatedCase = await Case.findOneAndUpdate(
      { _id: caseId, "tasks._id": id },
      {
        $set: {
          "tasks.$.text": text,
          "tasks.$.startDate": startDate,
          "tasks.$.endDate": endDate,
          "tasks.$.assignedTo": assignTo,
          "tasks.$.status": status,
          "tasks.$.allDay": allDay,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedCase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const { caseId, taskId } = req.params;

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    res.status(200).json(updatedCase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

exports.addTask = async (req, res) => {
  const { caseId } = req.params;
  const {
    text,
    assignedTo,
    startDate,
    endDate,
    allDay = false,
    description,
  } = req.body;
  console.log(req.body);

  try {
    const newTask = {
      text,
      assignedTo,
      startDate,
      endDate,
      allDay,
      status: "Pending",
      description,
    };

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $push: { tasks: newTask } },
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    sendNotification(
      updatedCase.user,
      "User",
      `New task added to case: ${updatedCase.case_title}`,
      req.app.get("io")
    );
    sendNotification(
      updatedCase.lawyer,
      "Lawyer",
      `New task added to case: ${updatedCase.case_title}`,
      req.app.get("io")
    );
    res.status(201).json(updatedCase);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Failed to add task", error });
  }
};
