const express = require("express");
const {
  getAddresses,
  removeAddress,
  addAddress,
} = require("../controllers/adresses.controller");
const Auth = require("../controllers/auth.controller");

const router = express.Router();
router.use(Auth.protect, Auth.allowedTo("user"));
router.route("/").get(getAddresses).post(addAddress);
router.route("/:addressId").delete(removeAddress);

module.exports = router;
