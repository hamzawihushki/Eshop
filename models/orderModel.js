const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    cartItem: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: Number,
    shippingPrice: Number,
    totalOrderPrice: Number,
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card"],
      default: "Cash",
    },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },

    paidAt: Date,
    deliveredAt: Date,
    shippingAddress: {
      city: String,
      street: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email phone profileImg",
  }).populate({
    path: "cartItem.product",
    select: "title coverImage ",
  });

  next();
});

module.exports = mongoose.model("Order", orderSchema);
