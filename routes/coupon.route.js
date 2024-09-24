const express = require("express");
const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");

// const {
//   getCouponValidator,
//   createCouponValidator,
//   updateCouponValidator,
//   deleteCouponValidator,
// } = require("../utils/validators/CouponValidator");

const Auth = require("../controllers/auth.controller");

const router = express.Router();
router
  .route("/")
  .post(Auth.protect, Auth.allowedTo("manger", "admin"), createCoupon)
  .get(getCoupons);
router
  .route("/:id")
  .get(getCouponById)
  .put(Auth.protect, Auth.allowedTo("manger", "admin"), updateCoupon)
  .delete(Auth.protect, Auth.allowedTo("admin"), deleteCoupon);

module.exports = router;
