const express = require("express");
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  addProductIdAndUserToBody,
  filterReviewsObject,
} = require("../controllers/review.controller");

const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

const Auth = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    Auth.protect,
    Auth.allowedTo("user"),
    addProductIdAndUserToBody,
    createReviewValidator,
    createReview
  )
  .get(filterReviewsObject, getReviews);
router
  .route("/:id")
  .get(getReviewById)
  .put(Auth.protect, Auth.allowedTo("user"), updateReview)
  .delete(
    Auth.protect,
    Auth.allowedTo("user", "admin", "manger"),
    deleteReview
  );

module.exports = router;
