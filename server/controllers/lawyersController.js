const Lawyer = require("../models/lawyerModel");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

exports.getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    res.status(200).json({
      status: "success",
      results: lawyers.length,
      data: {
        lawyers,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
