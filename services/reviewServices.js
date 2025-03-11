const ReviewModel = require("../models/reviewModel");
const factory = require("./FactoryHandler");


exports.SetProductIdAnduserIdTOBody = (req,res,next)=>{
    if(!req.body.product) req.body.product = req.params.productId ;
    if(!req.body.user) req.body.user = req.user._id
    next();
}

exports.createFilterBbj = (req,res,next)=>{
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObject=filterObject; // add func to req 
    next();
  }




//@desc Create Review
//@route Post /api/v1/reviews
//@accsess private/protect/role:user
exports.createReview = factory.createone(ReviewModel);

//@desc Get All Reviews
//@route Get /api/v1/reviews
//@accsess Public
exports.getAllReviews = factory.getAll(ReviewModel);

//@desc Get Spicfice Review
//@route Get /api/v1/reviews/:id
//@accsess Public
exports.getReview = factory.getone(ReviewModel);

//@desc Update Spicfice Review
//@route Put /api/v1/reviews/:id
//@accsess private/protect/role:user
exports.updateReview = factory.updateone(ReviewModel);

//@desc delete Spicfice Review
//@route Delete /api/v1/reviews/:id
//@accsess private/protect/role:user-admin-manger
exports.deleteReview = factory.deleteone(ReviewModel);
