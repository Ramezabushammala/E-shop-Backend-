const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      trim: true,
      required: [true, "code coupon required"],
    },
    discount: {
      type: Number,
      required: [true, "discount coupon required"],
    },
    expirationDate: {
      type: Date,
      required: [true, "expiration date coupon required"],
    },  
  },
  { timestamps: true }
);

 const CouponModel =mongoose.model("coupon",CouponSchema); 

 module.exports = CouponModel ;
