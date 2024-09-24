const { check, body } = require("express-validator");

const validationResult = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.addProductToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid wishlist ID Format")
    .custom(async (val, { req }) =>
      User.findOne({ wishlist: val }).then((user) => {
        if (user) {
          return Promise.reject(
            new Error(`The wishlist with id ${val} already exists`)
          );
        }
        return true;
      })
    ),

  validationResult,
];
exports.deleteProductFromWishlistValidator = [
  check("productId").isMongoId().withMessage("Invalid wishlist ID Format"),

  validationResult,
];
