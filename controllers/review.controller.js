const Review = require("../models/reviewModel");

const handlerFactory = require("./handlersFactory");

exports.addProductIdAndUserToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.filterReviewsObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObject = filterObject;
  next();
};

// create Review
exports.createReview = handlerFactory.create(Review);
//  get all Brands
exports.getReviews = handlerFactory.get(Review);
// get Review by id
exports.getReviewById = handlerFactory.getById(Review, "review");
// delete Review
exports.deleteReview = handlerFactory.delete(Review);
// update Review
exports.updateReview = handlerFactory.update(Review);
