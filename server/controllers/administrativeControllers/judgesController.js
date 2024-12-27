const mongoose = require("mongoose");
const Judge = require("../../models/administrative/Judge");
const CourtBranch = require("../../models/administrative/courtBranch");
const getNextIdValue = require("../SequencesController/SequencesController");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const addJudge = async (req, res, next) => {
  if (
    req.body.ssid &&
    req.body.first_name &&
    req.body.second_name &&
    req.body.third_name &&
    req.body.last_name &&
    req.body.city &&
    req.body.address_st &&
    req.body.gender &&
    req.body.birthdate &&
    req.body.phone &&
    req.body.email &&
    req.body.password &&
    req.body.court_name &&
    req.body.qualifications &&
    req.body.experience
  ) {
    const courtBranch = await CourtBranch.findById(req.body.court_name);

    if (!courtBranch) {
      res.status(400).json({ data: "court not found" });
    }

    let judge_id = await getNextIdValue("employeeId");
    judge_id = judge_id.toString();

    const pp_photo = req.files["pp_photo"] ? req.files["pp_photo"][0] : [];
    const id_photo = req.files["id_photo"] ? req.files["id_photo"][0] : [];
    const judge_photo = req.files["judge_photo"]
      ? req.files["judge_photo"][0]
      : [];

    const judge = new Judge({
      judge_id: judge_id,
      ssid: req.body.ssid,
      first_name: req.body.first_name,
      second_name: req.body.second_name,
      third_name: req.body.third_name,
      last_name: req.body.last_name,
      address: { city: req.body.city, street: req.body.address_st },
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      court_name: req.body.court_name,
      qualifications: req.body.qualifications,
      experience: req.body.experience,
      judge_photo: req.files["photo"][0]?.buffer,
      id_photo: id_photo,
      pp_photo: pp_photo,
      isValid: true,
    });
    const result = await judge.save();
    res.json(result);
  } else {
    res.status(400).json({ data: "mising, some fields" });
  }
};

const getJudges = async (req, res, next) => {
  try {
    const result = await Judge.find()
      .select("-judge_photo -id_photo -pp_photo")
      .limit(100)
      .populate("court_name")
      .exec();

    if (result.lenth === 0) {
      res.status(404).json({ message: "no judges found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "internal server error" }, error);
  }
};

const getJudgeById = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "id not found" });
  }

  const result = await Judge.findOne({ judge_id: req.params.id })
    .populate("court_name")
    .exec();

  if (!result) {
    return res.status(404).json({ message: "judge not found" });
  }

  const judge_photo = result.judge_photo?.toString("base64");
  const id_photo = result.id_photo?.toString("base64");
  const pp_photo = result.pp_photo?.toString("base64");

  let judge = { data: result };

  if (judge_photo) {
    judge = { ...judge, judge_photo: judge_photo };
    result.judge_photo = "";
  }
  if (id_photo) {
    judge = { ...judge, id_photo: id_photo };
    result.id_photo = "";
  }
  if (pp_photo) {
    judge = { ...judge, pp_photo: pp_photo };
    result.pp_photo = "";
  }
  res.json(judge);
};

const getJudgeBySSID = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "id not found" });
  }

  const result = await Judge.findOne({ ssid: req.params.id })
    .populate("court_name")
    .exec();

  if (!result) {
    return res.status(404).json({ message: "judge not found" });
  }

  const judge_photo = result.judge_photo?.toString("base64");
  const id_photo = result.id_photo?.toString("base64");
  const pp_photo = result.pp_photo?.toString("base64");

  let judge = { data: result };

  if (judge_photo) {
    judge = { ...judge, judge_photo: judge_photo };
    result.judge_photo = "";
  }
  if (id_photo) {
    judge = { ...judge, id_photo: id_photo };
    result.id_photo = "";
  }
  if (pp_photo) {
    judge = { ...judge, pp_photo: pp_photo };
    result.pp_photo = "";
  }
  res.json(judge);
};

const getJudgesByCourtId = async (req, res, next) => {
  if (!req.params.id) {
    return res.status(400).json({ message: "id not found" });
  }

  const result = await Judge.find({ court_name: req.params.id })
    .select("-judge_photo -id_photo -pp_photo")
    .populate("court_name")
    .exec();

  if (result.length === 0) {
    return res.status(404).json({ message: "judges not found" });
  }
  res.status(200).json({ result });
};

exports.addJudge = addJudge;
exports.getJudges = getJudges;
exports.getJudgeById = getJudgeById;
exports.getJudgesByCourtId = getJudgesByCourtId;
exports.getJudgeBySSID = getJudgeBySSID;
