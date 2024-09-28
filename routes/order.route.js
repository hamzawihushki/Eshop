const express = require("express");
const {
  createOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
  webhookCheckout,
} = require("../controllers/order.controller");

const Auth = require("../controllers/auth.controller");

const router = express.Router();

//checkout webhook
router.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

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
  Auth.allowedTo("manger", "admin", "user"),
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
