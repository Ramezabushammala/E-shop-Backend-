const express = require("express");
const reviewRoute = require("./ReviewRoutes");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");
const AuthServices = require("../services/authServices");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  DeleteProduct,
  uploadImagesProdact,
  resizeImageProduct,
} = require("../services/productServices");

const router = express.Router();
//nested Route
//Get prodacts/:productId/reviews/reviewsId  يشتغل بدون اي عملية لاني دحلت فعليا الى راوت الريفيو وداخل الراوت يوجد ريفيو محدد 
//{{URL}}/api/v1/prodacts/67ab53d42b05646875495a9c/reviews/67af1a76fcf735c9bb27c759
router.use("/:productId/reviews",reviewRoute);


router
  .route("/")
  .get(getProducts)
  .post(
    AuthServices.protect,
    AuthServices.allowedTo("admin", "manger"),
    uploadImagesProdact,
    resizeImageProduct,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    AuthServices.protect,
    AuthServices.allowedTo("admin", "manger"),
    uploadImagesProdact,
    resizeImageProduct,
    updateProductValidator,
    updateProduct
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowedTo("admin", "manger"),
    deleteProductValidator,
    DeleteProduct
  );

module.exports = router;
