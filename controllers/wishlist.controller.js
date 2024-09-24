const UserModel = require("../models/userModel");
const asyncWrapper = require("../middlewares/asyncWrapper");
const ApiError = require("../utils/ApiError");

exports.addProductToWishlist = asyncWrapper(async (req, res, next) => {
  if (!req.body.productId) {
    return next(new ApiError("Product ID is required", 400));
  }
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $push: { wishlist: req.body.productId } },
    { new: true }
  );
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({ data: user, message: "Product added to wishlist." });
});
exports.removeProductFromWishlist = asyncWrapper(async (req, res, next) => {
  if (!req.body.productId) {
    return next(new ApiError("Product ID is required", 400));
  }
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.body.productId } },
    { new: true }
  );
  res
    .status(200)
    .json({ data: user, message: "Product removed from wishlist." });
});
exports.getWishlist = asyncWrapper(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate({
    path: "wishlist",
    select: "title price",
  });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
  res.status(200).json({ data: user.wishlist, message: "Wishlist fetched." });
});
