const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controllers/category.controller");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const Auth = require("../controllers/auth.controller");

const subCategoriesRoute = require("./subcategory.route");

const router = express.Router();
router.use("/:categoryId/subcategory", subCategoriesRoute);
router
  .route("/")
  .post(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get(getCategories);
router
  .route("/:id")
  .get(getCategoryValidator, getCategoryById)
  .put(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    Auth.protect,
    Auth.allowedTo("manger"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
