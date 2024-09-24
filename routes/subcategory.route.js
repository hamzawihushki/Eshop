const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  filterSubCategoryObject,
  addCategoryIdToBody,
} = require("../controllers/subCategory.controller");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  deleteSubCategoryValidator,
  updateSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const Auth = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    addCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(filterSubCategoryObject, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategoryById)
  .put(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    Auth.protect,
    Auth.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
