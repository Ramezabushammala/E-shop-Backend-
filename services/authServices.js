const Crypto = require("crypto"); //pilt in function in nodejs
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");
const userModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const { CreteToken } = require("../utils/createToken");
const { sanitizeUser } = require("../utils/sanatizeData");

//@dec Signup
//@route GET /api/v1/auth/signup
//@access Public

exports.SignUp = asyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // genrate token
  const token = CreteToken(user._id);

  res.status(201).json({ data: sanitizeUser(user), token });
});

//@dec login
//@route GET /api/v1/auth/login
//@access Public

exports.Login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  // genrate token
  const token = CreteToken(user._id);

  res.status(200).json({ data: sanitizeUser(user), token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // console.log (req.headers.authorization);
  // check if token exixtss , if exist hold it
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("You are not logged in", 401));
  }
  //verify token (no change happens , expireToken)
  //التوكن يمكن أن يتغير عند انتهاء صلاحيته (exp) أو عند تغيير المفتاح السري (JWT_SECRET_KEY).
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //check if user exixts in db
  const currentuser = await userModel.findById(decoded.userid);
  if (!currentuser) {
    return next(
      new ApiError("The user that belong to this token does no exist", 401)
    );
  }
  //check if user change password after Time create token
  if (currentuser.TimeChangePassword) {
    const changePasswordtimestamp = parseInt(
      currentuser.TimeChangePassword.getTime() / 1000,
      10
    );
    if (changePasswordtimestamp > decoded.iat) {
      return next(
        new ApiError("Your password has been changed, please login again", 401)
      );
    }
  }
  req.user = currentuser;
  next();
});
//...role = ["admin","manger"]
exports.allowedTo = (...role) =>
  asyncHandler(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      next(new ApiError("you not allowed to accsses this route", 403));
    }
    next();
  });

//@dec forgetPassword
//@route GET /api/v1/auth/forgetpassword
//@access Public

exports.ForgetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    next(new ApiError("not found email, please meak sure is email", 404));
  }
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  // random code يتم استخدامه بشكل شائع لإنشاء تجزئات (Hashes) ثابتة، مثل إنشاء تجزئة لكود معين
  // bcrypt = require("bcryptjs"); تستحدم للتشفير كلمات السر
  const randomCodeHash = Crypto.createHash("sha256")
    .update(randomCode)
    .digest("hex");
  user.randomCodehash = randomCodeHash;
  user.passwordResetCodeExpire = Date.now() + 10 * 60 * 1000;
  user.passwordVerifieRestCode = false;
  // save hascode in db
  user.save();

  //send random code via email
  const message = `Hi ${user.name},\n we received a request to reset the password on your E-shop Account. \n ${randomCode} \n Enter this code to complete  the reset \n Thanks for helping us keep your account secure \n The E-shop Team `
  
    await sendEmail({
      email: user.email,
      subject: "You Password reset code(valid for 10 min)",
      message,
    });
    return res.status(200).json({status : "Sucess" , message:" Reset code sent to email"});
  

  
});

//@dec verifypasswordcode
//@route GET /api/v1/auth/verifypasswordcode
//@access Public

exports.VerifyResetCode = asyncHandler(async (req,res,next)=>{
      const resetCodehash = Crypto.createHash("sha256")
      .update(req.body.resetcode)
      .digest("hex");  ;
     
      const user = await userModel.findOne({
        randomCodehash:resetCodehash,
        passwordResetCodeExpire:{$gt:Date.now()}
      });
      if(!user){
        return next(new ApiError ("invaild restcode or expired"))
      }
      user.passwordVerifieRestCode=true;
      user.save();
      return res.status(200).json({status:"Sucess",message:"Reset code verified"});
})

//@dec resetPassword
//@route GET /api/v1/auth/resetpassword
//@access Public

exports.ResetPassword = asyncHandler(async (req,res,next)=>{
  const user = await userModel.findOne({passwordVerifieRestCode:true})
  if(!user){
    return next(new ApiError ("reset Code not verified"))
    }
    user.password = req.body.newpassword;
    user.passwordVerifieRestCode =undefined;
    user.randomCodehash=undefined;
    user.passwordResetCodeExpire=undefined;
    user.save();
     // genrate token
     const token = CreteToken(user._id);
    return res.status(200).json({status:"Sucess",token});
})
