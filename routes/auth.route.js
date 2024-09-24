const express = require("express");
const {
  signUp,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/auth.controller");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.route("/signup").post(signupValidator, signUp);
router.route("/login").post(loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);
module.exports = router;
