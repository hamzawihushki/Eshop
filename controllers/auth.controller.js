const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const asyncWrapper = require("../middlewares/asyncWrapper");

const ApiError = require("../utils/apiError");
const { sendEmail } = require("../utils/sendEmail");
const createJWT = require("../utils/generateJWT");

exports.signUp = asyncWrapper(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = createJWT(user._id);
  res.status(201).json({
    data: user,
    token,
    message: "User created successfully",
  });
});

exports.login = asyncWrapper(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ApiError("Please provide email", 400));
  }
  if (!req.body.password) {
    return next(new ApiError("Please provide password", 400));
  }
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("email or password is incorrect", 404));
  }
  const token = createJWT(user._id);

  res.status(200).json({ data: user, token: token });
});
exports.protect = asyncWrapper(async (req, res, next) => {
  //[1] check if the token exists and hold it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not logged in", 401));
  }
  //[2] verify the token (no change , no expiration)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // ID for User
  //[3] find the user in the database by the user id
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new ApiError("User no longer exists", 404));
  }
  //[4] check if user change his password after token created
  if (user.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimeStamp > decoded.iat) {
      return next(
        new ApiError("User has changed password. Please login again", 401)
      );
    }
  }
  req.user = user;
  next();
});

exports.allowedTo = (
  ...roles //["admin", "manager"]
) =>
  asyncWrapper(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // user
      return next(
        new ApiError("You do not have permission to access this route", 403)
      );
    }
    next();
  });

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// VERIFY RESET CODT (OTP)
exports.verifyResetCode = asyncWrapper(async (req, res, next) => {
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  // check if the reset Code is valid or not expired
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid reset code or expired", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({ status: "Success", message: "Reset code verified" });
});

// RESET PASSWORD
exports.resetPassword = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`No user found with this email ${req.body.email}`, 404)
    );
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code is not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;

  user.save();
  const token = createJWT(user._id);
  res.status(200).json({ token, message: "Password reset successfully" });
});
