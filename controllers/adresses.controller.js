const UserModel = require("../models/userModel");
const asyncWrapper = require("../middlewares/asyncWrapper");
const ApiError = require("../utils/apiError");

exports.addAddress = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $push: { addresses: req.body } },
    { new: true }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({ data: user, message: "Successfully added" });
});
exports.removeAddress = asyncWrapper(async (req, res, next) => {
  const { addressId } = req.params;
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  );
  res.status(200).json({ data: user, message: "Successfully Removed" });
});
exports.getAddresses = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({ data: user.addresses });
});
