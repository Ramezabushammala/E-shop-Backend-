const express = require("express");
const {
  createCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponServices");
const AuthServices = require("../services/authServices");

const router = express.Router();

router.use(AuthServices.protect, AuthServices.allowedTo("admin", "manger"));

router.route("/").post(createCoupon).get(getAllCoupons);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
