const Job = require("../../models/administrative/job");
const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

const createJob = async (req, res) => {
  try {
    const { title, description, permissions } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "title and description are required",
      });
    }

    const newJob = new Job({
      title,
      description,
      permissions: permissions || {},
      isValid: true,
    });

    const savedJob = await newJob.save();

    res.status(201).json({
      message: "Job created successfully!",
      job: savedJob,
    });
  } catch (error) {
    // Handle errors
    console.error("Error creating job:", error);
    res.status(500).json({
      message: "Failed to create job.",
      error: error.message,
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    if (jobs.length === 0) {
      return res.status(404).json({
        message: "no jobs found",
      });
    }

    res.status(200).json({
      message: "Jobs fetched successfully!",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: "Failed to fetch jobs.",
      error: error.message,
    });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "id is required",
    });
  }
  try {
    const job = await Job.findById({ _id: id }).exec();
    if (!job) {
      return res.status(404).json({
        message: "no job is associated with this id",
      });
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      message: "Failed to fetch jobs.",
      error: error.message,
    });
  }
};

module.exports = { createJob, getAllJobs, getJobById };
