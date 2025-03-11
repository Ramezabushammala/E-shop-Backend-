const express = require("express");
const {
  SignUp,
  Login,
  ForgetPassword,
  VerifyResetCode,
  ResetPassword,
} = require("../services/authServices");
const {
  SignUpValidator,
  LoginValidator
} = require("../utils/validator/authValidator");

const router = express.Router();
 
router.post("/signup",SignUpValidator,SignUp)
router.post("/login",LoginValidator,Login)
router.post('/forgetpassword',ForgetPassword)
router.post('/verifypasswordcode',VerifyResetCode)
router.put('/resetpassword',ResetPassword)

module.exports = router;