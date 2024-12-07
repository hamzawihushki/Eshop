const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcrypt");

const slugify = require("slugify");
const UserModel = require("../models/userModel");
const handlerFactory = require("./handlersFactory");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");
const createJWT = require("../utils/generateJWT");
///////////////===============image uploads===================//////////
exports.uploadUserImage = uploadSingleImage("profileImg");

exports.resizeImage = asyncWrapper(async (req, res, next) => {
  if (req.file) {
    const filename = `user-${uuidv4()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImg = filename;
  }
  next();
});
///////////////////////============ Admin Permission============//////////////////////////
//  get all categories
exports.getUsers = handlerFactory.get(UserModel);
// get user by id
exports.getUserById = handlerFactory.getById(UserModel);
// create user
exports.createUser = handlerFactory.create(UserModel);
// delete user
exports.deleteUser = handlerFactory.delete(UserModel);
// update user
exports.updateUser = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      profileImg: req.body.profileImg,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  if (req.body.name) {
    user.slug = slugify(req.body.name);
  }
  if (!user) {
    return next(
      // eslint-disable-next-line no-undef
      new ApiError(`User not found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: user, message: "User updated successfully." });
});
exports.changePassword = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(
      // eslint-disable-next-line no-undef
      new ApiError(`User not found with id ${req.params.id}`, 404)
    );
  }
  res
    .status(200)
    .json({ data: user, message: "Password changed successfully." });
});

// ///////////////// user Permissions /////////////////////

// Get Logged User Data

exports.getLoggedUserData = asyncWrapper(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.updateLoggedUserPassword = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  const token = createJWT(user._id);
  res.status(200).json({ data: user, token });
});

exports.updateLoggedUserData = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name.trim(),
      email: req.body.email,
      profileImg: req.body.profileImg,
      phone: req.body.phone,
    },
    { new: true }
  );

  res.status(200).json({ data: user });
});
exports.deleteLoggedUserData = asyncWrapper(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(200).json({ status: "success" });
});
