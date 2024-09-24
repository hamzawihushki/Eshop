const categoryRoutes = require("./category.route");
const subCategoryRoute = require("./subcategory.route");
const brandRoute = require("./brand.route");
const productRoute = require("./product.route");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const reviewRoute = require("./review.route");
const wishlistRoute = require("./wishlist.route");
const addressRoute = require("./addresses.route");
const couponRoute = require("./coupon.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");

const mountRoutes = (app) => {
  app.use("/api/categories", categoryRoutes);
  app.use("/api/subcategories", subCategoryRoute);
  app.use("/api/brands", brandRoute);
  app.use("/api/products", productRoute);
  app.use("/api/users", userRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/review", reviewRoute);
  app.use("/api/wishlist", wishlistRoute);
  app.use("/api/address", addressRoute);
  app.use("/api/coupon", couponRoute);
  app.use("/api/cart", cartRoute);
  app.use("/api/order", orderRoute);
};

module.exports = mountRoutes;
