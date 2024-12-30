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

    if (!title || !description || !permissions) {
      return res.status(400).json({
        message: "title and description are required",
      });
    }

    let perms = {
      users: {
        view: permissions.users?.view || false,
        manage: permissions.users?.manage || false,
      },
      employees: {
        view: permissions.employees?.view || false,
        manage: permissions.employees?.manage || false,
      },
      judges: {
        view: permissions.judges?.view || false,
        manage: permissions.judges?.manage || false,
      },
      cases: {
        view: permissions.cases?.view || false,
        manage: permissions.cases?.manage || false,
        assign: permissions.cases?.assign || false,
        control: permissions.cases?.control || false,
      },
      caseTypes: {
        view: permissions.caseTypes?.view || false,
        manage: permissions.caseTypes?.manage || false,
      },
      courtBranches: {
        view: permissions.courtBranches?.view || false,
        manage: permissions.courtBranches?.manage || false,
      },
      jobs: {
        view: permissions.jobs?.view || false,
        manage: permissions.jobs?.manage || false,
      },
      scheduled: {
        view: permissions.scheduled?.view || false,
      },
    };

    const newJob = new Job({
      title,
      description,
      permissions: perms,
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

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the job",
      error: error.message,
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job deleted successfully",
      data: deletedJob,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while deleting the job",
      error: error.message,
    });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
