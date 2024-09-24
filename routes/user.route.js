const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changePassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../controllers/user.controller");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  changeMyPasswordValidator,
  changeMyDataValidator,
} = require("../utils/validators/userValidator");

const Auth = require("../controllers/auth.controller");

const router = express.Router();

router.get("/getMyData", Auth.protect, getLoggedUserData, getUserById);
router.put(
  "/changeMyPassword",
  Auth.protect,
  changeMyPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/changeMyData",
  Auth.protect,
  changeMyDataValidator,
  updateLoggedUserData
);
router.delete("/deleteMyAccount", Auth.protect, deleteLoggedUserData);

// =============== Admin routes =============================
router.use(Auth.protect, Auth.allowedTo("manger", "admin"));
router
  .route("/changePassword/:id")
  .put(Auth.protect, changeUserPasswordValidator, changePassword);

router
  .route("/")
  .post(
    Auth.allowedTo("manger"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  )
  .get(getUsers);
router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
