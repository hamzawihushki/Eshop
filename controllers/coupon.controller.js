const Coupon = require("../models/couponModel");
const handlerFactory = require("./handlersFactory");

//  get all Coupons
exports.getCoupons = handlerFactory.get(Coupon);
// get Coupon by id
exports.getCouponById = handlerFactory.getById(Coupon);
// create Coupon
exports.createCoupon = handlerFactory.create(Coupon);
// delete Coupon
exports.deleteCoupon = handlerFactory.delete(Coupon);
// update Coupon
exports.updateCoupon = handlerFactory.update(Coupon);
