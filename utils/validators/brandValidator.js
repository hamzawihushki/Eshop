const { check, body } = require("express-validator");
const slugify = require("slugify");
const validationResult = require("../../middlewares/validatorMiddleware");
// Add custom validation rules here

exports.createBrandValidator = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Brand name must be between 2 and 50 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationResult,
];

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
  validationResult,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationResult,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand ID Format"),
  validationResult,
];
