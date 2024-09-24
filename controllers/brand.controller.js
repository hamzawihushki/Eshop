const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const BrandModel = require("../models/brandModel");
const asyncWrapper = require("../middlewares/asyncWrapper");
const handlerFactory = require("./handlersFactory");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeImage = asyncWrapper(async (req, res, next) => {
  const filename = `brands-${uuidv4()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;
  next();
});
//  get all Brands
exports.getBrands = handlerFactory.get(BrandModel);
// get Brand by id
exports.getBrandById = handlerFactory.getById(BrandModel);
// create Brand
exports.createBrand = handlerFactory.create(BrandModel);
// delete Brand
exports.deleteBrand = handlerFactory.delete(BrandModel);
// update Brand
exports.updateBrand = handlerFactory.update(BrandModel);
