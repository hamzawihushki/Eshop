const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcrypt");
const validationResult = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.createUserValidator = [
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
  check("phone")
    .optional()
    .isMobilePhone("ar-JO")
    .withMessage("please enter correct Jordan phone number"),
  validationResult,
];
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validationResult,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone("ar-JO")
    .withMessage("please enter correct Jordan phone number"),
  validationResult,
];
exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  body("currentPassword")
    .notEmpty()
    .withMessage("Please enter the current password correctly"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation required"),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (val !== req.body.confirmPassword) {
        throw new Error("incorrect Password confirmation ");
      }
      return true;
    }),
  validationResult,
];
exports.changeMyPasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Please enter the current password correctly"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("password confirmation required"),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      if (!user) {
        throw new Error("User not found");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }
      if (val !== req.body.confirmPassword) {
        throw new Error("incorrect Password confirmation ");
      }
      return true;
    }),
  validationResult,
];
exports.changeMyDataValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("User name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
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
  check("phone")
    .optional()
    .isMobilePhone("ar-JO")
    .withMessage("please enter correct Jordan phone number"),
  validationResult,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validationResult,
];
