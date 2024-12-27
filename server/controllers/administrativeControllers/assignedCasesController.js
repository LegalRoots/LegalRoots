const mongoose = require("mongoose");
const AssignedCases = require("../../models/administrative/assignedCases");
const Employee = require("../../models/administrative/employee");
const Case = require("../../models/administrative/case");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const createAssignment = async (req, res) => {
  try {
    const { caseId, employeeId } = req.body;

    if (!caseId || !employeeId) {
      return res.status(400).json({
        message: "caseId and employeeId are required.",
      });
    }

    if (caseId.length !== 24 || employeeId.length !== 24) {
      return res.status(400).json({
        message: "invalid caseId or employeeId",
      });
    }

    //make sure employee and case exists
    const employee = await Employee.findById({ _id: employeeId }).exec();
    const chosenCase = await Case.findById({ _id: caseId }).exec();

    if (!employee) {
      return res.status(404).json({
        message: "employee not found",
      });
    }

    if (!chosenCase) {
      return res.status(404).json({
        message: "case not found",
      });
    }

    const prevAssignment = await AssignedCases.findOne({
      caseId: caseId,
    });

    if (prevAssignment) {
      return res.status(400).json({
        message: "case is already assigned",
      });
    }

    const newAssignment = new AssignedCases({
      caseId,
      employeeId,
      isValid: true,
      add_date: new Date(),
    });

    const savedAssignment = await newAssignment.save();
    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { isAssigned: true, isActive: true },
      { new: true }
    );

    res.status(201).json({
      message: "Assignment created successfully!",
      assignment: savedAssignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      message: "Failed to create assignment.",
      error: error.message,
    });
  }
};

const getAllAssignedCases = async (req, res) => {
  try {
    assignedCases = await AssignedCases.find()
      .populate("caseId")
      .populate("employeeId", "-employee_photo");

    if (!assignedCases.length) {
      return res.status(404).json({
        message: "No assigned cases found.",
      });
    }

    res.status(200).json({
      count: assignedCases.length,
      assignedCases,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching assigned cases:", error);
    res.status(500).json({
      message: "Failed to fetch assigned cases.",
      error: error.message,
    });
  }
};

const getAssignedCasesByEmployeeId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  if (id.length !== 24) {
    return res.status(400).json({ message: "id is invalid" });
  }

  try {
    assignedCases = await AssignedCases.find({ employeeId: id, isValid: true })
      .populate("caseId")
      .populate("employeeId", "-employee_photo -id_photo");

    if (!assignedCases.length) {
      return res.status(404).json({
        message: "No assigned cases found.",
      });
    }

    res.status(200).json({
      count: assignedCases.length,
      assignedCases,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching assigned cases:", error);
    res.status(500).json({
      message: "Failed to fetch assigned cases.",
      error: error.message,
    });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { caseId, employeeId, assignmentId } = req.body;

    if (!caseId || !employeeId || !assignmentId) {
      return res.status(400).json({
        message: "caseId, employeeId, and assignmentId are required.",
      });
    }

    if (
      caseId.length !== 24 ||
      employeeId.length !== 24 ||
      assignmentId.length !== 24
    ) {
      return res.status(400).json({
        message: "Invalid caseId, employeeId, or assignmentId.",
      });
    }

    const employee = await Employee.findById({ _id: employeeId }).exec();
    const chosenCase = await Case.findById({ _id: caseId }).exec();
    const existingAssignment = await AssignedCases.findById({
      _id: assignmentId,
    }).exec();

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found.",
      });
    }

    if (!chosenCase) {
      return res.status(404).json({
        message: "Case not found.",
      });
    }

    if (!existingAssignment) {
      return res.status(404).json({
        message: "Assignment not found.",
      });
    }

    // Invalidate the previous assignment for the case
    const prevAssignment = await AssignedCases.findOneAndUpdate(
      { caseId: caseId, isValid: true },
      { isValid: false, disable_date: new Date() },
      { new: true }
    );

    // Create a new assignment
    const newAssignment = new AssignedCases({
      caseId,
      employeeId,
      isValid: true,
      add_date: new Date(),
    });

    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      message: "Assignment updated successfully!",
      previousAssignment: prevAssignment,
      newAssignment: savedAssignment,
    });
  } catch (error) {
    console.error("Error updating assignment:", error);
    res.status(500).json({
      message: "Failed to update assignment.",
      error: error.message,
    });
  }
};

module.exports = {
  createAssignment,
  getAllAssignedCases,
  getAssignedCasesByEmployeeId,
  updateAssignment,
};
