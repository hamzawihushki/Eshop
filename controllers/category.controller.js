const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const CategoryModel = require("../models/categoryModel");
const handlerFactory = require("./handlersFactory");
const asyncWrapper = require("../middlewares/asyncWrapper");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

///////////////===============image uploads===================//////////
exports.uploadCategoryImage = uploadSingleImage("image");

exports.resizeImage = asyncWrapper(async (req, res, next) => {
  if (req.file.buffer) {
    const filename = `category-${uuidv4()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    req.body.image = filename;
  }
  next();
});
///////////////////////========================//////////////////////////
//  get all categories
exports.getCategories = handlerFactory.get(CategoryModel);
// get category by id
exports.getCategoryById = handlerFactory.getById(CategoryModel);
// create category
exports.createCategory = handlerFactory.create(CategoryModel);
// delete category
exports.deleteCategory = handlerFactory.delete(CategoryModel);
// update category
exports.updateCategory = handlerFactory.update(CategoryModel);
