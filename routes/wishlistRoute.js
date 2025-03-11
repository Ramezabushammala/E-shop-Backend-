const express = require("express");
const {addproducttowishlist,removeProductfromwishlist,GetLogedUserwishlist} = require("../services/wishlistServices");
const AuthServices = require("../services/authServices");
const { AddWishlistValidator } = require("../utils/validator/wishlistValidator");


const router = express.Router();

router.use( AuthServices.protect,AuthServices.allowedTo("user"));

router.route("/").post(AddWishlistValidator,addproducttowishlist).get(GetLogedUserwishlist)
router.delete("/:productId",removeProductfromwishlist);

module.exports = router;