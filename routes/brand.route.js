const express = require("express");
const {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controllers/brand.controller");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const Auth = require("../controllers/auth.controller");

const router = express.Router();
router
  .route("/")
  .post(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(
    Auth.protect,
    Auth.allowedTo("manger", "admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    Auth.protect,
    Auth.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
