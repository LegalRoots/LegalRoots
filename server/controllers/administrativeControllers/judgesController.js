const mongoose = require("mongoose");
const Judge = require("../../models/Judge");
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
    req.body.court_type &&
    req.body.court_name &&
    req.body.qualifications &&
    req.body.experience
  ) {
    let judge_id = await getNextIdValue("employeeId");
    judge_id = judge_id.toString();

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
      court_type: req.body.court_type,
      court_name: req.body.court_name,
      qualifications: req.body.qualifications,
      experience: req.body.experience,
      judge_photo: req.files["photo"][0]?.buffer,
      id_photo: req.files["idPhoto"][0]?.buffer,
      pp_photo: req.files["ppPhoto"][0]?.buffer,
      isValid: true,
    });
    const result = await judge.save();
    res.json(result);
  } else {
    res.json({ data: "mising, some fields" });
  }
};

const getJudges = async (req, res, next) => {
  const result = await Judge.find()
    .select("-judge_photo -id_photo -pp_photo")
    .limit(100)
    .exec();

  res.json(result);
};

const getJudgeById = async (req, res, next) => {
  const result = await Judge.findOne({ judge_id: req.params.id }).exec();

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

exports.addJudge = addJudge;
exports.getJudges = getJudges;
exports.getJudgeById = getJudgeById;
