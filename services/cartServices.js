const asyncHandler = require("express-async-handler");
const CartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const ApiError = require("../utils/apiError");
const CouponModel = require("../models/couponModel");

const calculateCartPrice = (Cart) => {
  let totalPrice = 0;

  Cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  Cart.totalCarPrice = totalPrice;
  Cart.totalCarPriceAffterDiscount = undefined;
  return totalPrice;
};

exports.AddProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  //know is user exixts cart or not
  let Cart = await CartModel.findOne({ user: req.user._id });
  const product = await productModel.findById(productId);
  if (!Cart) {
    Cart = await CartModel.create({
      cartItems: [{ product: productId, color, price: product.price }],
      user: req.user._id,
    });
  } else {
    // is product exists in car ubdate quentity
    const productIndex = Cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex !== -1) {
      Cart.cartItems[productIndex].quantity += 1;
    } else {
      //is product not exists in car add product to car
      Cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  // Calculat total price in cart
  calculateCartPrice(Cart);

  await Cart.save(); // to save changed totalprice and quentity

  res.status(200).json({ status: "succsess", data: Cart });
});

exports.GetLogedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    next(new ApiError("Not Found Cart", 404));
  }
  calculateCartPrice(cart);
  res.status(200).json({
    status: "succsess",
    numberofCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.RemoveCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.id } },
    },
    { new: true }
  );

  // Calculat total price in cart
  calculateCartPrice(cart);

  cart.save();

  return res.json({
    stutas: "succsess",
    message: "remove cartItem from cartItems",
    data: cart,
  });
});

exports.RemoveAllCartItem = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });
  return res.json({
    status: "succsess",
    message: "remove all cartItem from cartItems",
  });
});

exports.UpdateCartItemQuentity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Not Found Cart", 404));
  }
  const indexcartitem = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );

  if (indexcartitem === -1) {
    return next(new ApiError("Not Found Cart Item", 404));
  }

 
  cart.cartItems[indexcartitem].quantity = quantity;

  // Calculat total price in cart
  calculateCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "succsess",
    numberofCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.ApplyCouponOnCart= asyncHandler(async (req, res, next) => {
  const coupon = await CouponModel.findOne({
    code: req.body.coupon,
    expirationDate: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Not Found Coupon or expired", 404));
  }

  const cart = await CartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Not Found Cart", 404));
  }

  const totalPrice = cart.totalCarPrice;
  const totalCarPriceAffterDiscount = parseFloat(
    (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2)
  );

  cart.totalCarPriceAffterDiscount = totalCarPriceAffterDiscount;

  await cart.save();

  return res.status(200).json({
    status: "success",
    numberofCartItems: cart.cartItems.length,
    data: cart,
  });
});
