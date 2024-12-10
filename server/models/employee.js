const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const employeeSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "First name is required!"],
  },
  employee_id: {
    type: String,
    unique: true,
    required: [true, "Employee ID is required!"],
  },
  last_name: {
    type: String,
    required: [true, "Last name is required!"],
  },
  ssid: {
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
  job: {
    type: String,
    required: [true, "Job is required!"],
  },
  birthdate: {
    type: String,
    required: [true, "Birthdate is required!"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  employee_photo: {
    type: String,
    default: "default.png",
  },
  id_photo: {
    type: Buffer,
  },
  isValid: {
    type: Boolean,
    required: true,
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
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  gender: {
    type: String,
  },
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
});

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

employeeSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

employeeSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

employeeSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

employeeSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
