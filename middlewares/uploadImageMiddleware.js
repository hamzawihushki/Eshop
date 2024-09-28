const multer = require("multer");
const ApiError = require("../utils/apiError");
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}.${ext}`;
//     cb(null, filename);
//     console.log(ext);
//   },
// });

exports.uploadSingleImage = (fieldName) => {
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("just image allowed"), false);
    }
  };
  const multerStorage = multer.memoryStorage();
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
