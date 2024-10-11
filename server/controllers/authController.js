const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const db = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("./../utils/sendEmail");
const { Op } = require("sequelize");

const User = db.User;
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const {
    username,
    firstname,
    lastname,
    email,
    password,
    passwordconfirm,
    role,
  } = req.body;
  const newUser = await User.create({
    username: username,
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    passwordconfirm: passwordconfirm,
    role: role,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({
    where: { email: email },
  });

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

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
  const decryptedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findByPk(decryptedToken.id);
  if (!currentUser) {
    return next(new AppError("No users found holding this token.", 401));
  }
  if (currentUser.changedPasswordAfter(decryptedToken.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ Where: { email: req.body.email } });
  if (!user) {
    return next(new AppError("There is no user with this email address.", 404));
  }

  const resetToken = user.generatePasswordToken();
  await user.save();

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/GreenThumb/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordconfirm to: ${resetURL}.`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

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
    Where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  const { password, passwordconfirm } = req.body;
  user.password = password;
  user.passwordconfirm = passwordconfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, passwordconfirm, passwordcurrent } = req.body;

  const user = await User.findByPk(req.user.id);

  if (!(await user.correctPassword(passwordcurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  user.password = password;
  user.passwordconfirm = passwordconfirm;
  await user.save();

  createSendToken(user, 200, res);
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findByPk(decoded.id);
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
    next();
  } else {
    return next(new AppError("You are not logged in, please log in", 401));
  }
};
