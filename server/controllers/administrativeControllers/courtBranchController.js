const mongoose = require("mongoose");
const CourtBranch = require("../../models/administrative/courtBranch");
const Employee = require("../../models/administrative/employee");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const createCourtBranch = async (req, res) => {
  const { name, city, admin } = req.body;

  if (!name || !city || !admin) {
    return res.status(400).json({ message: "misssing some required fields" });
  }

  const employee = await Employee.findOne({ employee_id: admin });

  if (!employee) {
    return res.status(404).json({ message: "employee not found" });
  }

  const courtbranch = await CourtBranch.findOne({ name: name });

  if (courtbranch) {
    return res.status(400).json({ message: "there is a court with this name" });
  }

  const newCourtBranch = new CourtBranch({
    name: name,
    city: city,
    admin: employee._id,
  });

  try {
    await newCourtBranch.save();
    res.status(200).json({ newCourtBranch });
  } catch (err) {
    res.status(500).json("internal server error");
    console.error("Error creating CourtBranch:", err);
  }
};

const updateCourtBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (
      updates.name === null ||
      updates.city === null ||
      updates.admin === null
    ) {
      return res
        .status(400)
        .json({ message: "Invalid updates. Fields cannot be null." });
    }

    const employee = await Employee.findOne({ employee_id: updates.admin });
    updates.admin = employee._id;

    const updatedCourtBranch = await CourtBranch.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedCourtBranch) {
      return res.status(404).json({ message: "CourtBranch not found." });
    }

    res.status(200).json(updatedCourtBranch);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the courtBranch." });
  }
};

const getAllCourtBranches = async (req, res) => {
  try {
    const courtBranches = await CourtBranch.find().populate("admin");

    res.status(200).json(courtBranches);
  } catch (err) {
    console.error("Error fetching court branches:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

const getCourtBranchById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "court id must be provided" });
  }
  try {
    const courtBranches = await CourtBranch.find({ _id: id }).populate("admin");

    res.status(200).json(courtBranches);
  } catch (err) {
    console.error("Error fetching court branches:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  createCourtBranch,
  getAllCourtBranches,
  getCourtBranchById,
  updateCourtBranch,
};
