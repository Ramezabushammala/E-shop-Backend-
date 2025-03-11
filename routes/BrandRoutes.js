const express = require("express");
const {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadbrandimage,
  resizeImage,
} = require("../services/brandServices");
const AuthServices = require("../services/authServices");
const {
  CreateBrandValidator,
  GetBrandValidator,
  UbdateBrandValidator,
  DeleteBrandValidator,
} = require("../utils/validator/brandValidator");

const router = express.Router();

  router.use( AuthServices.protect,AuthServices.allowedTo("admin", "manger"));

router
  .route("/")
  .post(
    uploadbrandimage,
    resizeImage,
    CreateBrandValidator,
    createBrand
  )
  .get(getAllBrands);
router
  .route("/:id")
  .get(GetBrandValidator, getBrand)
  .put(
    uploadbrandimage,
    resizeImage,
    UbdateBrandValidator,
    updateBrand
  )
  .delete(
    DeleteBrandValidator,
    deleteBrand
  );
module.exports = router;
