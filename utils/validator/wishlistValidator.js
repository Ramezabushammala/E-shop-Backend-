const { check} = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");
const productModel = require("../../models/productModel");

exports.AddWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("product Id is required")
    .custom(async(value, { req }) => 
       await productModel.findById(value).then((product) => {
        if (!product) {
            return Promise.reject(new Error ("Product not found"));
            }        
       return true ; // important
    })),
  validatorMiddleware,
];