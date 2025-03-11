const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");
const factory = require("./FactoryHandler");


exports.uploadbrandimage = uploadSingleImage("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`
    if(req.file){
        await sharp(req.file.buffer)
           .resize(600, 600)
           .toFormat("jpeg")
           .jpeg({ quality: 90 })
           .toFile(`uploads/brands/${filename}`);
           //save image in db
           // req.body.image=req.hostname+filename; save url in db
            req.body.image=filename;
    }
    next();
});

exports.createBrand = factory.createone(BrandModel);

exports.getAllBrands = factory.getAll(BrandModel);

exports.getBrand = factory.getone(BrandModel);

exports.updateBrand = factory.updateone(BrandModel);

exports.deleteBrand = factory.deleteone(BrandModel);
