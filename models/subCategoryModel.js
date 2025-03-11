const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // delete space in database "hp " =>"hp
      unique: [true, "SubCategory should be uniqe"],
      minlength: [2, "to short SubCategory name"],
      maxlength: [30, "to long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "category", // name parient category model
      required: [true, "subCategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategoryModel;
