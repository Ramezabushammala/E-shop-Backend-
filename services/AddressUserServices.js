const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

//@desc Add Address 
//@route Post /api/v1/addreses
//@accsess private/protect/role:user
exports.addAddressToAdresesUser= asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      //$addToSet add element in array in mongoedb if not exests
      $addToSet: { AdressesUser:req.body},
    },
    { new: true }
  );

  return res.json({
    stutas: "succsess",
    message: "add Address in Addreses list user",
    data: user.AdressesUser,
  });
});

//@desc remove Address from Addreses list users
//@route DELETE /api/v1/addreses
//@accsess private/protect/role:user
exports.removeAddressfromAddreseslistUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      //$Pull remove element in array in mongoedb if not exests
      $pull: { AdressesUser: {_id:req.params.addressId}},
    },
    { new: true }
  );

  return res.json({
    stutas: "succsess",
    message: "remove Address from Addreses list user",
    data: user.AdressesUser,
  });
});

//@desc Get loged user Addreses
//@route Get /api/v1/addreses
//@accsess private/protect/role:user

exports.GetLogedUserAddreses = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id)

  return res.json({
    stutas: "succsess",
    result: user.AdressesUser.length,
    data: user.AdressesUser,
  });
});