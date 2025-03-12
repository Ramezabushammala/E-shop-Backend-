const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const OrderModel = require("../models/orderModel");
const factory = require("./FactoryHandler");
const ApiError = require("../utils/apiError");
const CartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

//cash
exports.CreateCashOrder = asyncHandler(async (req, res, next) => {
  // Get Cart depend
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  //Get order price depend on cart price "Cheak if coupon apply"
  const orderPrice = cart.totalCarPriceAffterDiscount
    ? cart.totalCarPriceAffterDiscount
    : cart.totalCarPrice;
  // taxPrice and shipping setting app add to admin like taxprice = settingappModel.taxprice but me not meak do it
  const taxprice = 0;
  const shippingPrice = 0;
  const totalOrderPrice = orderPrice + taxprice + shippingPrice;

  //Create order with default paymentMethod cash
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddreses: req.body.shippingAddreses,
    totalOrderPrice,
  });
  if (order) {
    const bulkOperations = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { quantity: -item.quantity, sold: item.quantity },
        },
      },
    }));
    // After creating order , decrement product quentity , increment product sold
    //bulkWrite to use array operation but updateOne no use array operation
    await productModel.bulkWrite(bulkOperations);

    // Clear cart depend on cartId
    await CartModel.findOneAndDelete({ user: req.user._id });
  }

  return res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLogedUser = (req, res, next) => {
  if (req.user.role === "user") {
    req.filterObject = { user: req.user._id };
  }
  next();
};

exports.GetAllOrders = factory.getAll(OrderModel);

exports.GetOrder = factory.getone(OrderModel);

// by admin
exports.UpdateOrderPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order this id :${req.params.id}`, 404)
    );
  }
  if (order.isPaid === true) {
    return next(new ApiError(`Order is already paid`, 404));
  }
  order.isPaid = true;
  order.PaidAt = Date.now();
  await order.save();
  res.status(200).json({ status: "success", data: order });
});

// by admin
exports.UpdateOrderDeliver = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no order this id :${req.params.id}`, 404)
    );
  }
  if (order.isDelivered === true) {
    return next(new ApiError(`Order is already Delivered`, 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.status(200).json({ status: "success", data: order });
});

// @disc get checkout session from stripe and send it as response
// @route Get /api/v1/orders/checkout-session
// @access private/user
exports.CheckoutSession = asyncHandler(async (req, res, next) => {
  // Get Cart depend
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  //Get order price depend on cart price "Cheak if coupon apply"
  const orderPrice = cart.totalCarPriceAffterDiscount
    ? cart.totalCarPriceAffterDiscount
    : cart.totalCarPrice;
  // taxPrice and shipping setting app add to admin like taxprice = settingappModel.taxprice but me not meak do it
  const taxprice = 0;
  const shippingPrice = 0;
  const totalOrderPrice = orderPrice + taxprice + shippingPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.user.name,
            description: "Product Description",
          },
          unit_amount: totalOrderPrice * 100, // بالسنتات (20.00$)
        },

        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
    metadata: req.body.shippingAddreses,
  });
  res.status(200).json({ status: "success", session });
  // res.redirect(303, session.url);
});

const createCardOrder = async (session)=>{
  // create order
  const cartId = session.client_reference_id;
  const shippingAddreses=session.metadata;
  const orderPrice = session.amount_total/100;

  const cart = await CartModel.findById(cartId);
  const user = await userModel.findOne({email:session.customer_email});

//Create order with default paymentMethod card
  const order = await OrderModel.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddreses,
    totalOrderPrice:orderPrice,
    isPaid:true,
    PaidAt:Date.now(),
    paymentMethodType:'card'
  });
   
  if (order) {
    const bulkOperations = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { quantity: -item.quantity, sold: item.quantity },
        },
      },
    }));
    // After creating order , decrement product quentity , increment product sold
    //bulkWrite to use array operation but updateOne no use array operation
    await productModel.bulkWrite(bulkOperations);

    // Clear cart depend on cartId
    await CartModel.findByIdAndDelete(cartId)
  }
}

exports.WebhookCheckOut = asyncHandler(async (req, res, next) => {
  console.log("🔹 Webhook received!");
  
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
  if(event.type === "checkout.session.completed"){
    console.log("create Order Here ....");
    createCardOrder(event.data.object);
  }

  return res.status(200).json({received:true});

});
