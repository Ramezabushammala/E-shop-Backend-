
const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("./FactoryHandler");

exports.setCategoryIdToBody = (req,res,next)=>{
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
}

exports.createFilterBbj = (req,res,next)=>{
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject=filterObject; // add func to req 
  next();
}

//nested route
// Get /api/v1/categories/:categoryid/subcategories

exports.CreateSubCategory =factory.createone(SubCategoryModel);

exports.getSubCategorys = factory.getAll(SubCategoryModel);

exports.getSubCategory = factory.getone(SubCategoryModel);

exports.UpdateSubCategory = factory.updateone(SubCategoryModel);

exports.DeleteSubCategory = factory.deleteone(SubCategoryModel);
