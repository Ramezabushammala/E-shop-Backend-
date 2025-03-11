const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: { type: mongoose.Schema.ObjectId, ref: "product" },
        quantity: { type: Number, default: 1 },
        price: Number,
        color: String,
      },
    ],
    totalCarPrice: Number,
    totalCarPriceAffterDiscount: Number,
    user: { type: mongoose.Schema.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("cart", CartSchema);

module.exports = CartModel;
