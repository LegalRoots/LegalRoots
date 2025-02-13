const mongoose = require("mongoose");
const Court = require("../../models/administrative/court");
const Case = require("../../models/administrative/case");

const Employee = require("../../models/administrative/employee");
const Judge = require("../../models/administrative/Judge");
const Lawyer = require("../../models/lawyerModel");
const User = require("../../models/userModel");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const buildList = (ssidList, tmpList) => {
  let finalList = [];
  if (!ssidList.length) {
    return [];
  }
  if (tmpList.length) {
    tmpList.forEach((item) => {
      finalList.push({
        ssid: item.ssid,
        name: item.first_name + " " + item.last_name,
      });
    });

    let t = tmpList.map((i) => i.ssid);
    console.log(t);
    ssidList.forEach((item) => {
      if (!t.includes(item)) {
        finalList.push({
          ssid: item,
          name: "N/A",
        });
      }
    });
  } else {
    ssidList.forEach((item) => {
      finalList.push({
        ssid: item.ssid,
        name: "N/A",
      });
    });
  }

  return finalList;
};

const getCourtDetailsByCourtId = async (req, res) => {
  const { courtId } = req.params;
  let courtDetails = {};
  if (!courtId) {
    return res.status(400).json({ message: "id is required" });
  }

  try {
    const court = await Court.findById(courtId);
    if (!courtId) {
      return res.status(404).json({ message: "court not found" });
    }

    const pickedCase = await Case.findById(court.caseId).populate([
      { path: "caseType", select: "name" },
      { path: "court_branch", select: "name" },
    ]);

    if (!pickedCase) {
      return res.status(404).json({ message: "error occured, case not found" });
    }
    //filling basic details
    courtDetails.caseId = court.caseId;
    courtDetails.time = court.time;
    courtDetails.caseType = pickedCase.caseType.name;
    courtDetails.court_branch = pickedCase.court_branch.name;
    courtDetails.hasStarted = court.hasStarted;
    courtDetails.hasFinished = court.hasFinished;
    courtDetails.meeting_id = court.meeting_id;

    courtDetails.defense_team = [
      ...pickedCase.defendant_lawyers,
      pickedCase.defendant,
    ];
    courtDetails.plaintiff_team = [
      ...pickedCase.plaintiff_lawyers,
      pickedCase.plaintiff,
    ];

    let usersSSIDs = court.permissions
      .filter((p) => {
        return p.role.toLowerCase() === "user";
      })
      .map((u) => u.userId);

    let lawyersSSIDs = court.permissions
      .filter((p) => {
        return p.role.toLowerCase() === "lawyer";
      })
      .map((u) => u.userId);

    let employeesSSIDs = court.permissions
      .filter((p) => {
        return p.role.toLowerCase() === "employee";
      })
      .map((u) => u.userId);

    let judgesSSIDs = court.admins;

    let tmpUsers = await User.find({ SSID: { $in: usersSSIDs } });
    let tmpLawyers = await Lawyer.find({ SSID: { $in: lawyersSSIDs } });
    let tmpEmployees = await Employee.find({ ssid: { $in: employeesSSIDs } });
    let tmpJudges = await Judge.find({ ssid: { $in: judgesSSIDs } });

    tmpLawyers = tmpLawyers.map((k) => {
      return { first_name: k.first_name, last_name: k.last_name, ssid: k.SSID };
    });

    tmpUsers = tmpUsers.map((k) => {
      return { first_name: k.first_name, last_name: k.last_name, ssid: k.SSID };
    });

    courtDetails.users = buildList(usersSSIDs, tmpUsers);
    courtDetails.lawyers = buildList(lawyersSSIDs, tmpLawyers);
    courtDetails.employees = buildList(employeesSSIDs, tmpEmployees);
    courtDetails.judges = buildList(judgesSSIDs, tmpJudges);

    return res.status(200).json({ court: courtDetails });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

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
    const courts = await Court.find()
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
      .sort({ time: -1 })
      .limit(100)
      .exec();

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
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
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

    if (!id) {
      return res.status(400).json({ message: "invalid court id" });
    }

    if (id.length !== 24) {
      return res.status(400).json({ message: "invalid court id" });
    }

    const court = await Court.findById(id)
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
      .exec();

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
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
      .sort({ time: -1 })
      .limit(100)
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

//use ssid
const getCourtsByGuestId = async (req, res) => {
  try {
    const { id } = req.params;

    const courts = await Court.find({ guests: id })
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
      .sort({ time: -1 })
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

const validateGuest = async (req, res) => {
  const { id } = req.params;
  const { ssid } = req.body;
  if (!id) {
    return res.status(400).json({ message: "meeting id is required" });
  }
  if (!ssid) {
    return res.status(400).json({ message: "ssid is required" });
  }

  try {
    const court = await Court.findOne({ meeting_id: id, hasStarted: true })
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
      .exec();

    if (!court) {
      return res.status(404).json({ message: "no court found" });
    }

    if (court.guests.includes(ssid) || court.admins.includes(ssid)) {
      return res.status(200).json({
        status: "success",
        message: `user ${ssid} is authorized`,
        court: court,
      });
    } else {
      return res.status(401).json({
        status: "failed",
        message: `user ${ssid} is not authorized`,
      });
    }
  } catch (error) {
    console.error("Error fetching courts:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const validateAction = async (req, res) => {
  const { id } = req.params;
  const { ssid, perm } = req.body;
  if (!id) {
    return res.status(400).json({ message: "court id is required" });
  }
  if (!ssid || !perm) {
    return res
      .status(400)
      .json({ message: "ssid and premission are required" });
  }

  try {
    const court = await Court.findOne({ _id: id })
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
      .exec();

    if (!court) {
      return res.status(404).json({ message: "no court found" });
    }

    //here check
    const item = court.permissions.find((p) => p.userId === ssid);
    let isValid = false;
    if (item.permissions.includes(perm)) {
      isValid = true;
    }

    if (isValid) {
      return res.status(200).json({
        status: "success",
        message: `user ${ssid} is authorized`,
      });
    } else {
      return res.status(401).json({
        status: "failed",
        message: `user ${ssid} is not authorized`,
      });
    }
  } catch (error) {
    console.error("Error fetching courts:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const manageAction = async (req, res) => {
  const { id } = req.params;
  const { ssid, perm, type } = req.body;
  if (!id) {
    return res.status(400).json({ message: "court id is required" });
  }
  if (!ssid || !perm || !type) {
    return res
      .status(400)
      .json({ message: "ssid, type and premission are required" });
  }

  try {
    let court = await Court.findOne({ _id: id })
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      })
      .exec();

    if (!court) {
      return res.status(404).json({ message: "no court found" });
    }

    //here apply
    for (let i = 0; i < court.permissions.length; i++) {
      const item = court.permissions[i];
      if (item.userId === ssid) {
        if (type === "remove" && item.permissions.includes(perm)) {
          item.permissions = item.permissions.filter((p) => p !== perm);
        } else if (type === "add" && !item.permissions.includes(perm)) {
          item.permissions.push(perm);
        }
      }
    }

    //now save to database
    const updatedCourt = await Court.findOneAndReplace({ _id: id }, court, {
      returnDocument: "after",
    });

    return res.status(200).json({
      status: "success",
      message: `user ${ssid} is authorized`,
      court: updatedCourt,
    });
  } catch (error) {
    console.error("Error fetching courts:", error);
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

const getCourtsByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const courts = await Court.find({
      time: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ time: -1 })
      .populate({
        path: "initiator",
        select: "-judge_photo -pp_photo -id_photo",
      });

    res.status(200).json({
      message: "Courts retrieved successfully",
      data: courts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving courts",
      error: error.message,
    });
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
  getCourtDetailsByCourtId,
  getCourtsByDate,
  validateGuest,
  validateAction,
  manageAction,
};
