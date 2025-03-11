const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const factory = require("./FactoryHandler");
const ApiError = require("../utils/apiError");
const { CreteToken } = require("../utils/createToken");

exports.createUser = factory.createone(userModel);

exports.getUsers = factory.getAll(userModel);

exports.getUser = factory.getone(userModel);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileimage: req.body.profileimage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("document not found", 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      TimeChangePassword: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("document not found", 404));
  }
  res.status(200).json({ data: document });
});

exports.deleteUser = factory.deleteone(userModel);

exports.GetLogedDataUser = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

exports.UbdatepasswordLogedUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      TimeChangePassword: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!user) {
    return next(new ApiError("user not found", 404));
  }
  const token = CreteToken(user._id);
  res.status(200).json({ data: user, token });
});

exports.UpdateDataLogedUser = asyncHandler(async (req, res, next) => {
  //ubdate data without password and role this for admin
  const ubdateuser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({data:ubdateuser})
});

exports.DeleteLogedUser = asyncHandler(async(req,res,next)=>{
   await userModel.findByIdAndUpdate(req.user._id,
    {
      active:false
    }
  ,{new:true})
  res.status(200).json({status:"succsess"})
})

