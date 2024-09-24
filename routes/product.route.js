const express = require("express");

const reviewRoute = require("./review.route");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeImage,
} = require("../controllers/product.controller");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const Auth = require("../controllers/auth.controller");

const router = express.Router();
router.use("/:productId/review", reviewRoute);

router
  .route("/")
  .post(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    uploadProductImages,
    resizeImage,
    createProductValidator,
    createProduct
  )
  .get(getProducts);
router
  .route("/:id")
  .get(getProductValidator, getProductById)
  .put(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    updateProductValidator,
    updateProduct
  )
  .delete(
    Auth.protect,
    Auth.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
