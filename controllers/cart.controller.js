const asyncWrapper = require("../middlewares/asyncWrapper");
const ApiError = require("../utils/apiError");
const Cart = require("../models/cartModel");
const Product = require("../models/productModal");
const Coupon = require("../models/couponModel");

function calculatePrice(cart) {
  let totalPrice = 0;
  cart.cartItem.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPrice = totalPrice;
  return totalPrice;
}
// @desc    Add product to cart
exports.addCart = asyncWrapper(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    // Create a new cart for logged user with product
    cart = await Cart.create({
      user: req.user._id,
      cartItem: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exists already in cart , update product quantity
    const itemIndex = cart.cartItem.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (itemIndex > -1) {
      cart.cartItem[itemIndex].quantity += 1;
    } else {
      // product not exist in cart , push product to cartItem Array
      cart.cartItem.push({
        product: productId,
        color,
        price: product.price,
      });
    }
  }
  // calculate total Price
  calculatePrice(cart);

  await cart.save();
  res
    .status(200)
    .json({ data: cart, message: "Product added to cart successfully" });
});

exports.getLoggedCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  res.status(200).json({ data: cart, message: "Cart retrieved successfully" });
});
exports.removeCartItem = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItem: { _id: req.params.itemId } } },
    { new: true }
  );
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  calculatePrice(cart);
  await cart.save();
  res
    .status(200)
    .json({ data: cart, message: "Product removed from cart successfully" });
});
exports.clearCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  res.status(200).json({ message: "Cart cleared successfully" });
});
exports.updateCartItemQuantity = asyncWrapper(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItem.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItem[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItem[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calculatePrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItem.length,
    data: cart,
  });
});
// @desc    Apply coupon to cart
exports.applyCoupon = asyncWrapper(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon not found or expired", 404));
  }
  const cart = await Cart.findOne({
    user: req.user._id,
  });
  calculatePrice(cart);
  cart.totalPriceAfterDiscount = (
    cart.totalPrice -
    (cart.totalPrice * coupon.discount) / 100
  ).toFixed(2);
  await cart.save();

  res.status(200).json({ data: cart, message: "Coupon applied successfully" });
});
