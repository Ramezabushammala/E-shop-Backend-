const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required:[true,"user is required"]
    },
    cartItems:[
          {
            product: { type: mongoose.Schema.ObjectId, ref: "product" },
            quantity:Number,
            price: Number,
            color: String,
          },
        ],
        taxPrice:{
            type:Number,
            default:0
        },
        shippingAddreses:{
            type:String,
            details:String,
            phone:String,
            city:String,
            postalCode:String
        },
        shippingPrice:{
            type:Number,
            default:0
        },
        totalOrderPrice:Number,
        paymentMethodType:{
            type:String,
            enum:["cash","card"],
            default:"cash"
        },
        isPaid:{
            type:Boolean,
            default:false
        },
        PaidAt:Date,
        isDelivered:{
            type:Boolean,
            default:false
            },
            deliveredAt:Date,

},{timestamps:true})

OrderSchema.pre(/^find/,function(next){
    this.populate({path:"user",select:"name phone email profileimage"})
    .populate({path:"cartItems.product",select:"title imageCover"});
    next();
})

const OrderModel= mongoose.model("order",OrderSchema); 

module.exports = OrderModel;