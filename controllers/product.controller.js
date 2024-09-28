const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ProductModel = require("../models/productModal");

const handlerFactory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const asyncWrapper = require("../middlewares/asyncWrapper");

const multerStorage = multer.memoryStorage();
const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("just image allowed"), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = upload.fields([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.resizeImage = asyncWrapper(async (req, res, next) => {
  if (req.files.coverImage) {
    const coverImageFileName = `products-${uuidv4()}-cover.jpeg`;
    await sharp(req.files.coverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${coverImageFileName}`);

    req.body.coverImage = coverImageFileName;
  }
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imagesFileName = `products-${uuidv4()}-${index + 1}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagesFileName}`);

        req.body.images.push(imagesFileName);
      })
    );
    console.log(req.body.images);
    console.log(req.body.coverImage);
    next();
  }
});

//  get all Products
exports.getProducts = handlerFactory.get(ProductModel);
// get Product by id
exports.getProductById = handlerFactory.getById(ProductModel, "reviews");
// create Product
exports.createProduct = handlerFactory.create(ProductModel);
// delete Product
exports.deleteProduct = handlerFactory.delete(ProductModel);
// update Product
exports.updateProduct = handlerFactory.update(ProductModel);
