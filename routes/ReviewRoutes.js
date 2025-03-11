const express = require("express");

const AuthServices = require("../services/authServices");
const {
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
  SetProductIdAnduserIdTOBody,
  createFilterBbj,
} = require("../services/reviewServices");
const {
  CreateReviewValidator,
  UbdateReviewValidator,
  GetReviewValidator,
  DeleteReviewValidator,
} = require("../utils/validator/reviewValidator");

// mergeParams allow us to acsses paramters on other routers
//ex : to neednto accsess produuctId from product route parent
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthServices.protect,
    AuthServices.allowedTo("user"),
    SetProductIdAnduserIdTOBody,
    CreateReviewValidator,
    createReview
  )
  .get(createFilterBbj,getAllReviews);
router
  .route("/:id")
  .get(GetReviewValidator, getReview)
  .put(
    AuthServices.protect,
    AuthServices.allowedTo("user"),
    UbdateReviewValidator,
    updateReview
  )
  .delete(
    AuthServices.protect,
    AuthServices.allowedTo("user", "admin", "manger"),
    DeleteReviewValidator,
    deleteReview
  );
module.exports = router;
