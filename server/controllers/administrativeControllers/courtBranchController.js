const mongoose = require("mongoose");
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

const createCourtBranch = async (req, res) => {
  const { name, city, admin } = req.body;

  if (!name || !city || !admin) {
    return res.status(400).json({ message: "misssing some required fields" });
  }

  const newCourtBranch = new CourtBranch({
    name: name,
    city: city,
    admin: admin,
  });

  try {
    await newCourtBranch.save();
    res.status(400).json({ newCourtBranch });
  } catch (err) {
    res.status(500).json("internal server error");
    console.error("Error creating CourtBranch:", err);
  }
};

const getAllCourtBranches = async (req, res) => {
  try {
    const courtBranches = await CourtBranch.find();

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
    const courtBranches = await CourtBranch.find({ _id: id });

    res.status(200).json(courtBranches);
  } catch (err) {
    console.error("Error fetching court branches:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = { createCourtBranch, getAllCourtBranches, getCourtBranchById };
