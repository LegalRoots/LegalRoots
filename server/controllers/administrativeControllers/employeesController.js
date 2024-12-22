const Employee = require("../../models/administrative/employee");
const CourtBracnh = require("../../models/administrative/courtBranch");
const mongoose = require("mongoose");
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

const addEmployee = async (req, res, next) => {
  //store your image in database
  // const photoBuffer = fs.readFileSync("./uploads/me.jpg");
  if (
    req.body.ssid &&
    req.body.full_name &&
    req.body.job &&
    req.body.gender &&
    req.body.birthdate &&
    req.body.phone &&
    req.body.email &&
    req.body.password
  ) {
    let employee_id = await getNextIdValue("employeeId");
    employee_id = employee_id.toString();
    const employee = new Employee({
      ssid: req.body.ssid,
      employee_id,
      full_name: req.body.full_name,
      job: req.body.job,
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      court_branch: req.body.court_branch || "",
      employee_photo: req.files["photo"][0].buffer,
      id_photo: req.files["idPhoto"][0].buffer,
      isValid: true,
    });
    const result = await employee.save();
    res.json(result);
  } else {
    res.json({ message: "Error, missing some fields" });
  }
};
const getEmployees = async (req, res, next) => {
  let result = await Employee.find().exec();

  let employees = [];
  for (var i = 0; i < result.length; i += 1) {
    let image = result[i].employee_photo.toString("base64");
    result[i].employee_photo = "";
    const employee = { data: result[i], image: image };

    employees.push(employee);
  }

  res.json(employees);
};

const getEmployeesLight = async (req, res, next) => {
  let result = await Employee.find().exec();

  let employees = [];
  for (var i = 0; i < result.length; i += 1) {
    result[i].employee_photo = "";
    result[i].id_photo = "";
    const employee = { data: result[i] };

    employees.push(employee);
  }

  res.json(employees);
};

const getEmployeesByCourtId = async (req, res) => {
  const { courtId } = req.params;
  if (!courtId) {
    return res.status(400).json({ message: "court id is required" });
  }
  if (courtId.length !== 24) {
    return res
      .status(400)
      .json({ message: "court id should be of exactly 24 characters" });
  }

  try {
    const employees = await Employee.find({ court_branch: courtId })
      .select("-employee_photo -id_photo")
      .exec();

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: `no employees found at court ${courtId}` });
    }

    return res
      .status(200)
      .json({ count: employees.length, employees: employees });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

const getEmployeesByCourtName = async (req, res) => {
  const { courtName } = req.params;
  if (!courtName) {
    return res.status(400).json({ message: "court id is required" });
  }

  try {
    //check if court exists
    const courtBranch = await CourtBracnh.findOne({ name: courtName }).exec();
    if (!courtBranch) {
      return res.status(404).json({ message: "court not found" });
    }

    const employees = await Employee.find({ court_branch: courtBranch._id })
      .select("-employee_photo -id_photo")
      .exec();

    if (employees.length === 0) {
      return res
        .status(404)
        .json({ message: `no employees found at court ${courtName}` });
    }

    return res
      .status(200)
      .json({ count: employees.length, employees: employees });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

module.exports = {
  getEmployees,
  addEmployee,
  getEmployeesByCourtId,
  getEmployeesByCourtName,
  getEmployeesLight,
};
