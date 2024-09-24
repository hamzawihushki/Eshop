const SubCategoryModel = require("../models/subCategoryModel");

const handlerFactory = require("./handlersFactory");
// ------------------- Middleware ----------------
exports.addCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.filterSubCategoryObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
  }
  req.filterObject = filterObject;
  next();
};

//  get all subCategors
exports.getSubCategories = handlerFactory.get(SubCategoryModel);
// get subCategory by id
exports.getSubCategoryById = handlerFactory.getById(SubCategoryModel);
// create subCategory
exports.createSubCategory = handlerFactory.create(SubCategoryModel);
// delete subCategory
exports.deleteSubCategory = handlerFactory.delete(SubCategoryModel);
// update subCategory
exports.updateSubCategory = handlerFactory.update(SubCategoryModel);
