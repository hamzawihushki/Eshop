const { check, body } = require("express-validator");
const slugify = require("slugify");
const validationResult = require("../../middlewares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to category")
    .isMongoId()
    .withMessage("invalid category id Format "),

  validationResult,
];
exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validationResult,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationResult,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validationResult,
];
