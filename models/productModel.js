const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: [100, "Too long product title"],
      minLength: [3, "Too short product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Prodact description is required"],
      trim: true,
      maxLength: [1000, "Too long product description"],
      minLength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAftarDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      // min max => number minlengthe maxlengthe => string
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be below or equal 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { 
    timestamps: true,
    //to enable virtuals populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Mongosse query middlware pre before send database
productSchema.pre(/^find/, function (next){
  this.populate({
    path: 'category',
    select: 'name',
});
next();
});

const setImageUrl = (doc)=>{
  if(doc.imageCover){
      const imageUrl =`${process.env.BASE_URL}/products/${doc.imageCover}`
      doc.imageCover = imageUrl;
  }
  if(doc.images){
    const imageList = [];

    doc.images.forEach(image => {
      const imageUrl =`${process.env.BASE_URL}/products/${image}`
      imageList.push(imageUrl)
    });
     doc.images =imageList;
  }
}

//virtual populate show reviews in product collection
productSchema.virtual("reviews",{
  ref: "Review",
  foreignField: "product",
  localField: "_id",
})

// run in getAll , getone, ubdate
productSchema.post('init', (doc)=> {
  //doc is data return after init in db 
   setImageUrl(doc);
});

//run in cretate category time save doc in db
productSchema.post('save', (doc)=> {
  //doc is data return after save in db 
 setImageUrl(doc);
});
const productModel = mongoose.model("product", productSchema);
module.exports = productModel;
