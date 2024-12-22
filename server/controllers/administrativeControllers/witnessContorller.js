const mongoose = require("mongoose");
const Witness = require("../../models/administrative/witness");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const createWitness = async (req, res) => {
  try {
    const { user_id, case_id } = req.body;
    const description = req.body.description ?? "";
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const newWitness = new Witness({ case_id, user_id, description });
    await newWitness.save();

    res
      .status(201)
      .json({ message: "Witness created successfully", witness: newWitness });
  } catch (error) {
    console.error("Error creating witness:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getWitnessByCaseId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "case_id is required" });
    }

    const witnesses = await Witness.find({ case_id: id });

    if (witnesses.length === 0) {
      return res
        .status(404)
        .json({ message: "No witnesses found for the given case_id" });
    }

    res
      .status(200)
      .json({ message: "Witnesses retrieved successfully", witnesses });
  } catch (error) {
    console.error("Error retrieving witnesses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createWitness, getWitnessByCaseId };
