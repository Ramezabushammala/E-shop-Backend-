const express = require("express");
const {addAddressToAdresesUser,removeAddressfromAddreseslistUser,GetLogedUserAddreses} = require("../services/AddressUserServices");
const AuthServices = require("../services/authServices");



const router = express.Router();

router.use( AuthServices.protect,AuthServices.allowedTo("user"));

router.route("/").post(addAddressToAdresesUser).get(GetLogedUserAddreses)
router.delete("/:addressId",removeAddressfromAddreseslistUser);

module.exports = router;