const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");


const productModel = require("../models/productModel");
const factory = require("./FactoryHandler");

const { uploadMixofImages } = require("../middlewares/uploadImageMiddleware");


exports.uploadImagesProdact =uploadMixofImages([
    {
     name:"imageCover",
     maxCount:1
    },
    {
     name:"images",
     maxCount:5
    }
]);

exports.resizeImageProduct = asyncHandler(async(req,res,next)=>{
    //prossing coverimage
    if(req.files.imageCover){
         const filenameImageCover = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
         await sharp(req.files.imageCover[0].buffer)
            .resize(2000,1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${filenameImageCover}`);
            //save image in db
             req.body.imageCover=filenameImageCover;
    }
    //prossing images
    req.body.images=[];
    
    if(req.files.images){

     await Promise.all(req.files.images.map(async(img,index)=>{
        const filenameImage = `product-${uuidv4()}-${Date.now()}-${index+1}.jpeg`
        await sharp(img.buffer)
           .resize(2000,1333)
           .toFormat("jpeg")
           .jpeg({ quality: 90 })
           .toFile(`uploads/products/${filenameImage}`);
           //save image in db
           req.body.images.push(filenameImage);
    }))  
    }

   next();
});

exports.createProduct =factory.createone(productModel);

exports.getProducts = factory.getAll(productModel,"products");

exports.getProduct = factory.getone(productModel,"reviews");

exports.updateProduct = factory.updateone(productModel);

exports.DeleteProduct = factory.deleteone(productModel);