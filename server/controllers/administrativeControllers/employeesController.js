const express = require("express");
const Employee = require("../../models/employee");
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

exports.getEmployees = getEmployees;
exports.addEmployee = addEmployee;
