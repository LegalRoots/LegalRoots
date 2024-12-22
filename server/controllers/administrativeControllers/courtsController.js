const mongoose = require("mongoose");
const Court = require("../../models/administrative/court");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const createCourt = async (req, res) => {
  try {
    const {
      initiator,
      caseId,
      admins,
      guests,
      permissions,
      time,
      description,
    } = req.body;
    if (
      !initiator ||
      !admins ||
      !guests ||
      !permissions ||
      !caseId ||
      !description
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Create the court document
    const newCourt = new Court({
      meeting_id: "",
      hasStarted: false,
      hasFinished: false,
      caseId: caseId,
      description,
      time: time,
      initiator,
      admins,
      guests,
      permissions,
    });

    const savedCourt = await newCourt.save();

    return res.status(201).json({
      message: "Court created successfully",
      data: savedCourt,
    });
  } catch (error) {
    console.error("Error creating court:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find().populate("admins", "-__v").exec();
    // Respond with the retrieved courts
    return res.status(200).json({
      message: "Courts retrieved successfully",
      count: courts.length,
      data: courts,
    });
  } catch (error) {
    console.error("Error fetching courts:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getCourtsByCaseId = async (req, res) => {
  const { caseId } = req.params;
  if (!caseId) {
    return res.status(400).json({ message: "case id is required" });
  }

  try {
    const courts = await Court.find({ caseId: caseId })
      .populate("admins", "-__v")
      .exec();

    return res.status(200).json({
      message: "Courts retrieved successfully",
      count: courts.length,
      courts: courts,
    });
  } catch (error) {
    console.error("Error fetching courts:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getCourtById = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.findById(id).populate("admins", "-__v").exec();

    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }

    return res.status(200).json({
      message: "Court retrieved successfully",
      data: court,
    });
  } catch (error) {
    console.error("Error fetching court by ID:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getCourtsByJudgeId = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.find({ admins: id })
      .populate("admins", "-__v")
      .exec();

    if (!court) {
      return res
        .status(404)
        .json({ message: "Court not found for the specified judge" });
    }

    return res.status(200).json({
      message: "Court retrieved successfully",
      data: court,
    });
  } catch (error) {
    console.error("Error fetching court by judge ID:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getCourtsByGuestId = async (req, res) => {
  try {
    const { id } = req.params;

    const courts = await Court.find({ guests: id })
      .populate("admins", "-__v")
      .exec();

    if (!courts.length) {
      return res
        .status(404)
        .json({ message: "No courts found for the specified guest" });
    }

    return res.status(200).json({
      message: "Courts retrieved successfully",
      data: courts,
    });
  } catch (error) {
    console.error("Error fetching courts by guest ID:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const setMeetingId = async (req, res) => {
  try {
    const { courtId, meeting_id } = req.body;

    const court = await Court.findById(courtId);

    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }
    //set the courts values
    court.meeting_id = meeting_id;
    court.hasStarted = true;

    await court.save();

    return res.status(200).json({
      message: "Court meeting_id updated successfully",
      data: court,
    });
  } catch (error) {
    console.error("Error updating meeting_id:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getMeetingId = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.findById(id);

    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }

    return res.status(200).json({
      message: "Court meeting_id retrieved successfully",
      data: { meeting_id: court.meeting_id },
    });
  } catch (error) {
    console.error("Error retrieving meeting_id:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.findById(id);
    console.log(id);
    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }

    await Court.findByIdAndDelete(id);

    res.status(200).json({ message: "Court deleted successfully" });
  } catch (error) {
    console.error("Error deleting court:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const replaceCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const newCourtData = req.body;

    if (
      !newCourtData.caseId ||
      !newCourtData.description ||
      !newCourtData.time ||
      !newCourtData.initiator ||
      !newCourtData.permissions
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedCourt = await Court.findByIdAndUpdate(id, newCourtData, {
      new: true,
      overwrite: true,
    });

    if (!updatedCourt) {
      return res.status(404).json({ message: "Court not found" });
    }

    res
      .status(200)
      .json({ message: "Court replaced successfully", court: updatedCourt });
  } catch (error) {
    console.error("Error replacing court:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createCourt,
  getAllCourts,
  getCourtById,
  getCourtsByJudgeId,
  getCourtsByGuestId,
  setMeetingId,
  getMeetingId,
  getCourtsByCaseId,
  deleteCourt,
  replaceCourt,
};
