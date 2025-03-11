const { check} = require("express-validator");

const validatorMiddleware = require("../../middlewares/validetorMiddleware");
const ReviewModel = require("../../models/reviewModel");

exports.CreateReviewValidator = [
  check("title").optional(),
  check("ratings")
  .notEmpty()
  .withMessage("rating value is requierd")
  .isFloat({min:1,max:5})
  .withMessage("reating sholad be between 1 to 5"),
  check("product")
  .isMongoId()
  .withMessage("Invalid Review id product format")
  .custom(async(val,{req})=>
   await ReviewModel.findOne({user:req.user._id,product:req.body.product}).then(
     (review)=>{
       if(review){
         throw new Error("You have already reviewed this product");
       }
       }
      
    )),
  validatorMiddleware,
];

exports.GetReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];
exports.UbdateReviewValidator = [
    check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val,{req})=>
       ReviewModel.findById(val).then(
          (review)=>{
             if(!review){
               return Promise.reject(new Error(`there is no review with id ${val}`));
            }
            //عند مقارنة ObjectId بـ String باستخدام !==، فإنهما لا يكونان متساويين لأن JavaScript لا يقوم بتحويل الأنواع تلقائيًا هنا.
            if(review.user._id.toString()!== req.user._id.toString()){
              return Promise.reject(new Error("you are not allowad to ubdate this review"));
            }
          }
          )
    ),

    validatorMiddleware,
  ];
  exports.DeleteReviewValidator = [
    check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val,{req})=>{
          if(req.user.role === "user"){
          return  ReviewModel.findById(val).then((review)=>{
              if(!review){
                return Promise.reject(new Error(`there is no review with id ${val}`));
             }
              if(review.user._id.toString() !== req.user._id.toString()){
                return Promise.reject(new Error("you are not allowad to delete this review"));
              }
            })
          }
          return true ;
    }),
    validatorMiddleware,
  ];
