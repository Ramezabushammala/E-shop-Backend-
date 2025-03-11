const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

//@desc Add product in wishlist users
//@route Post /api/v1/wishlist
//@accsess private/protect/role:user
exports.addproducttowishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      //$addToSet add element in array in mongoedb if not exests
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  return res.json({
    stutas: "succsess",
    message: "add productId in wishlest user",
    data: user.wishlist,
  });
});

//@desc remove product from wishlist users
//@route DELETE /api/v1/wishlist
//@accsess private/protect/role:user
exports.removeProductfromwishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      //$Pull remove element in array in mongoedb if not exests
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  return res.json({
    stutas: "succsess",
    message: "remove productId from wishlest user",
    data: user.wishlist,
  });
});

//@desc Get loged user wishlist
//@route Get /api/v1/wishlist
//@accsess private/protect/role:user

exports.GetLogedUserwishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("wishlist");

  return res.json({
    stutas: "succsess",
    result: user.wishlist.length,
    data: user.wishlist
  });
});
