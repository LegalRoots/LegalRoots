const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const Lawyer = require("./../models/lawyerModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Employee = require("../models/employee");
const sendEmail = require("./../utils/SendEmail");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res, role) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
      userType: role,
    },
  });
};

exports.checkEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(200).json({ exists: true });
  }
  res.status(200).json({ exists: false });
});
exports.checkSSID = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ SSID: req.body.ssid });
  if (user) {
    return res.status(200).json({ exists: true });
  }
  res.status(200).json({ exists: false });
});
exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.userType === "Lawyer") {
    console.log(req.body);
    try {
      const newLawyer = await Lawyer.create({
        SSID: req.body.SSID,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birthday: req.body.birthday,
        gender: req.body.gender,
        phone: req.body.phone,
        street: req.body.street,
        city: req.body.city,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        cv: req.files.cv[0].filename,
        practicing_certificate: req.files.practicing_certificate[0].filename,
        specialization: req.body.specialization,
        consultation_price: req.body.consultation_price,
        description: req.body.description,
        yearsOfExperience: req.body.years_of_experience,
      });

      createSendToken(newLawyer, 201, req, res, "Lawyer");
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.userType === "User") {
    console.log("im here");
    const newUser = await User.create({
      SSID: req.body.SSID,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      birthday: req.body.birthday,
      gender: req.body.gender,
      street: req.body.street,
      city: req.body.city,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      phone: req.body.phone,
    });
    console.log(newUser);
    createSendToken(newUser, 201, req, res, "User");
  }
});
exports.login = catchAsync(async (req, res, next) => {
  const { type } = req.body;

  if (type === "User") {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(user, 200, req, res);
  } else if (type === "Lawyer") {
    const { ssid, password } = req.body;

    if (!ssid || !password) {
      return next(new AppError("Please provide SSID and password!", 400));
    }

    const lawyer = await Lawyer.findOne({ lawyer_id: ssid }).select(
      "+password"
    );

    if (!lawyer) {
      return next(new AppError("Incorrect email or password", 401));
    }
    try {
      lawyer.lastActive = Date.now();
      await lawyer.save();
    } catch (err) {
      console.log(err);
    }
    createSendToken(lawyer, 200, req, res, "Lawyer");
  } else if (type === "Admin") {
    const { ssid, password } = req.body;
    if (!ssid || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    const admin = await Employee.findOne({ employee_id: ssid }).select(
      "+password"
    );

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }
    createSendToken(admin, 200, req, res, "Admin");
  }
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/LegalRoots/users/resetPassword/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      text: `Reset your password using the following link: ${resetURL}`,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, req, res);
});
