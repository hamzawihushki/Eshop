const { check, body } = require("express-validator");
const slugify = require("slugify");
const validationResult = require("../../middlewares/validatorMiddleware");
// Add custom validation rules here

exports.createCategoryValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationResult,
];

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validationResult,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationResult,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  validationResult,
];
