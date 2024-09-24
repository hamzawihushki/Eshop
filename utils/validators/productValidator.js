const { check, body } = require("express-validator");
const slugify = require("slugify");
const validationResult = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Product must be at least 3 characters")
    .notEmpty()
    .withMessage("Product Required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 500 })
    .withMessage("Product description is too long"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage(" sold quantity must be a number "),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be less than price");
      }
      return true;
    }),
  check("colors").optional().isArray().withMessage("colors must be an array"),
  check("images").optional().isArray().withMessage("images must be an array"),
  check("coverImage").notEmpty().withMessage("coverImage is required"),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("Invalid  Id Format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(new Error("Invalid category ID"));
        }
        return true;
      })
    ),

  check("brand")
    .notEmpty()
    .withMessage("brand is required")
    .isMongoId()
    .withMessage("Invalid  Id Format"),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id Format")
    .custom((subcategoriesIds) =>
      SubCategory.find({
        _id: { $exists: true, $in: subcategoriesIds },
      }).then((result) => {
        // eslint-disable-next-line eqeqeq
        if (result.length < 1 || result.length != subcategoriesIds.length) {
          return Promise.reject(new Error("Invalid subCategory ID(s)"));
        }
      })
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subCategoryIds) => {
          const subCategoriesIdsFromDB = [];
          subCategoryIds.forEach((subCategory) => {
            subCategoriesIdsFromDB.push(subCategory._id.toString());
          });
          if (!val.every((v) => subCategoriesIdsFromDB.includes(v))) {
            return Promise.reject(
              new Error(
                "Selected subCategory(s) not belong to the selected category"
              )
            );
          }
          console.log(subCategoryIds);
        }
      )
    ),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("ratingAverage must Above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("ratingAverage must be less than or equal 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuality must be a number"),

  validationResult,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validationResult,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validationResult,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  validationResult,
];
