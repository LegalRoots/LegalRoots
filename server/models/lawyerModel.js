const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const lawyerSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required!"],
  },
  last_name: {
    type: String,
    required: [true, "Last name is required!"],
  },
  SSID: {
    type: String,
    required: [true, "SSID is required!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  cv: {
    type: String,
    required: [true, "CV is required!"],
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required!"],
    enum: {
      values: [
        "Corporate Law",
        "Criminal Law",
        "Family Law",
        "Intellectual Property Law",
        "Tax Law",
        "Environmental Law",
        "Immigration Law",
        "Real Estate Law",
        "Employment Law",
        "Personal Injury Law",
      ],
      message: "{VALUE} is not a valid specialization",
    },
  },
  practicing_certificate: {
    type: String,
    required: [true, "Practicing certificate is required!"],
  },
  consultation_price: {
    type: Number,
    required: [true, "Consultation price is required!"],
  },
  description: {
    type: String,
  },
  assessment: {
    type: Number,
    min: 0,
    max: 5,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return this.isNew || this.isModified("password")
          ? el === this.password
          : true;
      },
      message: "Passwords are not the same!",
    },
  },

  city: {
    type: String,
  },
  street: {
    type: String,
  },

  photo: {
    type: String,
    default: "default.png",
  },
  gender: {
    type: String,
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  notifications: [
    {
      message: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      read: {
        type: Boolean,
        default: false,
      },
    },
  ],
  totalCases: {
    type: Number,
    default: 0,
  },
  closedCases: {
    type: Number,
    default: 0,
  },
  wonCases: {
    type: Number,
    default: 0,
  },
  lostCases: {
    type: Number,
    default: 0,
  },
  ongoingCases: {
    type: Number,
    default: 0,
  },
  clientReviews: [
    {
      clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      feedback: String,
      reviewedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  yearsOfExperience: {
    type: Number,
    required: [true, "Years of experience is required!"],
  },
  achievements: [String],
  additionalCertifications: [String],
  paymentMethods: [String],
  billingRate: {
    type: Number,
    required: false,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

const assignmentSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case",
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Denied"],
    default: "Pending",
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

lawyerSchema.add({
  assignments: [assignmentSchema],
});

lawyerSchema.plugin(AutoIncrement, { inc_field: "lawyer_id" });

lawyerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
lawyerSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.lastActive = Date.now();
  }
  next();
});
lawyerSchema.methods.calculateAverageRating = function () {
  if (this.clientReviews.length > 0) {
    const totalRating = this.clientReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    this.assessment = totalRating / this.clientReviews.length;
  } else {
    this.assessment = 0;
  }
};
lawyerSchema.pre("save", function (next) {
  if (this.isModified("clientReviews")) {
    this.calculateAverageRating();
  }
  next();
});
const Lawyer = mongoose.model("Lawyer", lawyerSchema);

module.exports = Lawyer;
