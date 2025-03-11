const express = require("express");
const { AddProductToCart, GetLogedUserCart, RemoveCartItem, RemoveAllCartItem, UpdateCartItemQuentity, ApplyCouponOnCart } = require("../services/cartServices");
const AuthServices = require("../services/authServices");

const router = express.Router();

router.use(AuthServices.protect, AuthServices.allowedTo("user"));

router.route("/").post(AddProductToCart).get(GetLogedUserCart).delete(RemoveAllCartItem);
router.put('/applycoupon',ApplyCouponOnCart)
router.route("/:id").put(UpdateCartItemQuentity).delete(RemoveCartItem);
//   .get(getAllBrands);
// router
//   .route("/:id")
//   .get(GetBrandValidator, getBrand)
//   .put(
//     uploadbrandimage,
//     resizeImage,
//     UbdateBrandValidator,
//     updateBrand
//   )
//   .delete(
//     DeleteBrandValidator,
//     deleteBrand
//   );
module.exports = router;
