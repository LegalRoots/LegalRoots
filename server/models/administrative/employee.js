const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const employeeSchema = new mongoose.Schema({
  ssid: { type: String, required: true },
  employee_id: { type: String, required: true },
  full_name: { type: String, required: true },
  first_name: { type: String, required: true },
  second_name: { type: String, required: true },
  third_name: { type: String, required: true },
  last_name: { type: String, required: true },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  gender: { type: String, required: true },
  birthdate: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  court_branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourtBranch",
    required: false,
  },
  employee_photo: Buffer,
  id_photo: Buffer,
  isValid: { type: Boolean, required: true },
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

employeeSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return candidatePassword === userPassword;
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
