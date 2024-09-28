const stripe = require("stripe")(
  "sk_test_51Q2crwGkfrGLZSsAAW2zRCYutGWnBOnEdwrgEn7RGx7TdmEOLfBlXPnvIGxIP4lcyIBwSsy91Fj2ycFNbv2CyamE00pAHUDybN"
);

const asyncWrapper = require("../middlewares/asyncWrapper");
const handlerFactory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const Cart = require("../models/cartModel");
const Product = require("../models/productModal");

const Order = require("../models/orderModel");

// @desc Create cash order
// @route /orders/cartId
exports.createOrder = asyncWrapper(async (req, res, next) => {
  const tax = 0;
  const shippingPrice = 0;
  // [1] get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  // [2] get order price depend on cart price (check if coupon applied)
  //   const orderPrice = cart.totalPriceAfterDiscount || cart.totalPrice;
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + tax + shippingPrice;
  // [3] create order with default payment method "cash"
  const order = await Order.create({
    user: req.user._id,
    cartItem: cart.cartItem,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress, // optionally cause Create Method
  });
  // [4] after create order , increment product sold & decrement product quantity
  if (order) {
    const bulkOpt = cart.cartItem.map((item) => ({
      updateOne: {
        filter: { _id: item.product }, // _id of product
        update: { $inc: { sold: +item.quantity, quantity: -item.quantity } },
      },
    }));

    await Product.bulkWrite(bulkOpt, {});
    // [5] clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({
    data: order,
    message: "Order created successfully",
  });
});

exports.filterOrderForLoggedUser = asyncWrapper(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findAllOrders = handlerFactory.get(Order);

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findSpecificOrder = handlerFactory.getById(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = !order.isPaid;

  if (!order.isPaid) {
    order.paidAt = null;
  } else {
    order.paidAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncWrapper(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isDelivered = !order.isDelivered;
  if (!order.isDelivered) {
    order.deliveredAt = null;
  } else {
    order.deliveredAt = Date.now();
  }

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc Get checkout session from Stripe and send it as a response
// @route /orders/checkout-session/cartId
exports.checkoutSession = asyncWrapper(async (req, res, next) => {
  const tax = 0;
  const shippingPrice = 0;

  // [1] Get cart depending on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  // [2] Get order price depending on cart price (check if coupon applied)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + tax + shippingPrice;

  // [3] Create checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100, // Amount in the smallest currency unit
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // [4] Send session to response
  res.status(200).json({
    status: "success",
    data: session,
  });
});
exports.webhookCheckout = asyncWrapper(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  console.log("Headers:", req.headers);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(event);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    console.log("create order heree. ............. ");
  }
});
