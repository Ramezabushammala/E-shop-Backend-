const CouponModel= require("../models/couponModel");

const factory = require("./FactoryHandler");


exports.createCoupon = factory.createone(CouponModel);

exports.getAllCoupons = factory.getAll(CouponModel);

exports.getCoupon = factory.getone(CouponModel);

exports.updateCoupon = factory.updateone(CouponModel);

exports.deleteCoupon = factory.deleteone(CouponModel);