const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const CategoryModel = require("../models/categoryModel");
const factory = require("./FactoryHandler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

exports.uploadCategoryimage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuidv4()}-${Date.now()}.jpeg`
    if(req.file){
        await sharp(req.file.buffer)
           .resize(600, 600)
           .toFormat("jpeg")
           .jpeg({ quality: 90 })
           .toFile(`uploads/categories/${filename}`);
           //save image in db
            req.body.image=filename;
    }
    next();
});

exports.createCategory = factory.createone(CategoryModel);

exports.getCategories = factory.getAll(CategoryModel);

exports.getSpesificCategory = factory.getone(CategoryModel);

exports.updateCategory = factory.updateone(CategoryModel);

exports.DeleteCategory = factory.deleteone(CategoryModel);
