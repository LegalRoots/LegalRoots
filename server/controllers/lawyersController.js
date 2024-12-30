const Lawyer = require("../models/lawyerModel");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");

exports.getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find()
      .populate("assignments.clientId")
      .populate("clientReviews.clientId", "first_name last_name");
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
exports.getLawyerDetails = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).populate(
      "assignments.clientId"
    );
    res.status(200).json({
      status: "success",
      data: lawyer,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Update a lawyer
exports.updateLawyer = async (req, res) => {
  try {
    const updatedLawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedLawyer) {
      return res.status(404).json({
        status: "fail",
        message: "No lawyer found with that ID",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        lawyer: updatedLawyer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete a lawyer
exports.deleteLawyer = async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndDelete(req.params.id);
    if (!lawyer) {
      return res.status(404).json({
        status: "fail",
        message: "No lawyer found with that ID",
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  const { lawyerId } = req.params;

  try {
    const lawyer = await Lawyer.findById(lawyerId).populate(
      "clientReviews.clientId",
      "first_name last_name"
    );

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found." });
    }

    res.status(200).json({
      reviews: lawyer.clientReviews,
      averageRating: lawyer.assessment,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};

exports.updateCaseStats = async (req, res) => {
  try {
    const { totalCases, closedCases, wonCases, lostCases, ongoingCases } =
      req.body;
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({
        status: "fail",
        message: "No lawyer found with that ID",
      });
    }

    if (totalCases !== undefined) lawyer.totalCases = totalCases;
    if (closedCases !== undefined) lawyer.closedCases = closedCases;
    if (wonCases !== undefined) lawyer.wonCases = wonCases;
    if (lostCases !== undefined) lawyer.lostCases = lostCases;
    if (ongoingCases !== undefined) lawyer.ongoingCases = ongoingCases;

    await lawyer.save();

    res.status(200).json({
      status: "success",
      data: {
        lawyer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.addClientReview = async (req, res) => {
  const { lawyerId } = req.params;
  const { user, rating, feedback } = req.body;

  try {
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Invalid rating provided." });
    }

    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found." });
    }

    lawyer.clientReviews.push({
      clientId: user,
      rating,
      feedback,
    });

    await lawyer.save();
    res.status(200).json({ message: "Feedback added successfully.", lawyer });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};

exports.updateClientReview = async (req, res) => {
  const { lawyerId, reviewId } = req.params;
  const { rating, feedback } = req.body;

  try {
    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found." });
    }

    const review = lawyer.clientReviews.id(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    if (rating) review.rating = rating;
    if (feedback) review.feedback = feedback;

    await lawyer.save();
    res.status(200).json({ message: "Feedback updated successfully.", lawyer });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "An error occurred.", error });
  }
};
exports.addAchievement = async (req, res) => {
  try {
    const { achievement } = req.body;
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({
        status: "fail",
        message: "No lawyer found with that ID",
      });
    }

    lawyer.achievements.push(achievement);
    await lawyer.save();

    res.status(200).json({
      status: "success",
      data: {
        lawyer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getLawyerBySSID = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ SSID: req.params.ssid });
    if (!lawyer) {
      return res.status(404).json({
        status: "fail",
        message: "No lawyer found with that SSID",
      });
    }
    res.status(200).json({
      status: "success",
      data: lawyer,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.recommendLawyer = async (req, res) => {
  const { limit = 5 } = req.query;

  try {
    const query = { isAvailable: true, isVerified: true };

    const lawyers = await Lawyer.find(query).populate("clientReviews.clientId");

    const scoredLawyers = lawyers.map((lawyer) => {
      const assessmentWeight = 0.4;
      const wonCasesWeight = 0.6;

      const score =
        (lawyer.assessment || 0) * assessmentWeight +
        (lawyer.wonCases || 0) * wonCasesWeight;

      return { ...lawyer.toObject(), score };
    });

    const recommendedLawyers = scoredLawyers
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    res.status(200).json(recommendedLawyers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching lawyers" });
  }
};

exports.verifyLawyer = async (req, res) => {
  try {
    const { lawyer_id } = req.params;

    if (!lawyer_id) {
      return res.status(400).json({ message: "Lawyer ID is required." });
    }

    const lawyer = await Lawyer.findOneAndUpdate(
      { _id: lawyer_id },
      { isVerified: true },
      { new: true, runValidators: true }
    );

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found." });
    }

    res.status(200).json({
      message: "Lawyer verification updated successfully.",
      lawyer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating lawyer verification.",
      error: error.message,
    });
  }
};
