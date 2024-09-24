const { check } = require("express-validator");
const slugify = require("slugify");

const validationResult = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject(new Error("Email already exists"));
        }
        return true;
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("the password must be at least 8 characters")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Password confirm is required"),
  validationResult,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("the password must be at least 8 characters"),

  validationResult,
];
