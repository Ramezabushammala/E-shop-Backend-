
const mongoose = require("mongoose");
const productModel = require("./productModel");

const reviewSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    ratings:{
        type:Number,
        required:[true,"review ratings required"],
        min:[1,'Min ratings value is 1.0'],
        max:[5,'Max ratings value is 5.0'],
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:[true,"Review must belong to user"],     
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'product',
        required:[true,"Review must belong to product"],
        },

},{timestamps:true})

reviewSchema.statics.getAverageRatingsAndQuentity = async function (productId) {
    const result = await this.aggregate([  //this return on modelreview
      { $match: { product: productId } }, // get reviews product from all reviews collection
      { $group: { _id: "$product", avgRating: { $avg: "$ratings" },reatQuantity:{$sum:1} } },
    ]);
   if(result.length>0){
      await productModel.findByIdAndUpdate(productId, { ratingsAverage: result[0].avgRating, ratingsQuantity: result[0].reatQuantity})
   }else{
    await productModel.findByIdAndUpdate(productId, { ratingsAverage: 0, ratingsQuantity: 0});
   }
};

  reviewSchema.post("save", async function () {
    await this.constructor.getAverageRatingsAndQuentity(this.product);
  });
  reviewSchema.post("findOneAndDelete", async (doc)=> {
    await doc.constructor.getAverageRatingsAndQuentity(doc.product);
  });

reviewSchema.pre(/^find/,function(next){
    this.populate({path:"user",select:"name"});
    next();
});

const ReviewModel = mongoose.model("Review",reviewSchema);

module.exports = ReviewModel;
