const express = require("express");
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlist,
} = require("../controllers/wishlist.controller");
const {
  addProductToWishlistValidator,
  deleteProductFromWishlistValidator,
} = require("../utils/validators/wishlistValidator");
const Auth = require("../controllers/auth.controller");

const router = express.Router();
router.use(Auth.protect, Auth.allowedTo("user"));
router
  .route("/")
  .get(getWishlist)
  .post(addProductToWishlistValidator, addProductToWishlist)
  .delete(deleteProductFromWishlistValidator, removeProductFromWishlist);

module.exports = router;
