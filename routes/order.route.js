const express = require("express");
const {
  createOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../controllers/order.controller");

const Auth = require("../controllers/auth.controller");

const router = express.Router();

router.get(
  "/checkout-session/:cartId",
  Auth.protect,
  Auth.allowedTo("user"),
  checkoutSession
);

router
  .route("/:cartId")
  .post(Auth.protect, Auth.allowedTo("user"), createOrder);
router.get(
  "/",
  Auth.protect,
  Auth.allowedTo("manger", "admin"),
  filterOrderForLoggedUser,
  findAllOrders
);
router.get("/:id", findSpecificOrder);

router.put(
  "/:id/pay",
  Auth.protect,
  Auth.allowedTo("manger", "admin"),
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  Auth.protect,
  Auth.allowedTo("manger", "admin"),
  updateOrderToDelivered
);

module.exports = router;
