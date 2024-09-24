const express = require("express");
const {
  addCart,
  getLoggedCart,
  removeCartItem,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../controllers/cart.controller");

const Auth = require("../controllers/auth.controller");

const router = express.Router();
router.use(Auth.protect, Auth.allowedTo("user"));
router.route("/").post(addCart).get(getLoggedCart).delete(clearCart);
router.put("/apply-coupon", applyCoupon);

router.route("/:itemId").put(updateCartItemQuantity).delete(removeCartItem);
module.exports = router;
