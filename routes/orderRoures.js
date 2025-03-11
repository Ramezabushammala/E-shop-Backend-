const express = require("express");
const AuthServices = require("../services/authServices");
const {
  CreateCashOrder,
  GetAllOrders,
  GetOrder,
  filterOrderForLogedUser,
  UpdateOrderPaid,
  UpdateOrderDeliver,
  CheckoutSession,
} = require("../services/orderServices");

const router = express.Router();

router.use(AuthServices.protect);

router.get(
  "/checkout-session",
  AuthServices.allowedTo("user"),
  CheckoutSession
);
router
  .route("/")
  .post(AuthServices.allowedTo("user"), CreateCashOrder)
  .get(
    AuthServices.allowedTo("user", "admin", "manger"),
    filterOrderForLogedUser,
    GetAllOrders
  );
router
  .route("/:id")
  .get(
    AuthServices.allowedTo("user", "admin", "manger"),
    filterOrderForLogedUser,
    GetOrder
  );
router
  .route("/:id/pay")
  .put(AuthServices.allowedTo("admin", "manger"), UpdateOrderPaid);
router
  .route("/:id/deliver")
  .put(AuthServices.allowedTo("admin", "manger"), UpdateOrderDeliver);
module.exports = router;
