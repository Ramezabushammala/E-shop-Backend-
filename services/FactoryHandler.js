const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const FeatureApi = require("../utils/featureApi");


exports.createone = (model)=>
    asyncHandler(async (req, res, next) => {
        const document = await model.create(req.body);
        
        res.status(201).json({ data: document });
      });
exports.getAll = (model,modelname="")=> 
    asyncHandler(async (req, res, next) => {
        let filtar = {};
        if(req.filterObject){
            filtar =req.filterObject; 
        }
        // Build quer
        const documentsCount = await model.countDocuments(); //beiltin fun
        const apiFeature = new FeatureApi(model.find(filtar), req.query)
          .pagenat(documentsCount)
          .sort()
          .fields();

          if (req.query.keyword) {
            apiFeature.search(modelname);
          }else{
              apiFeature.Filter();
          }
        //Execute query
        const { mongooseQuery, pagenationResult } = apiFeature;
        const documents = await mongooseQuery;
        res
          .status(201)
          .json({ results: documents.length, pagenationResult, data: documents });
      });      

exports.getone = (model,virtualoption)=>
       asyncHandler(async (req, res, next) => {
        // let filtar = req.params.id;
        // if(req.filterObject){
        //     filtar =req.filterObject; 
        // }
        //bulid query
        let query =  model.findById(req.params.id);
       if(virtualoption){
        query = query.populate(virtualoption)
       }
      
       
       //excute query
       const document = await query;  
        if (!document) {
          return next(new ApiError("document not found", 404));
        }
        res.status(200).json({ data: document });
      });

exports.deleteone = (model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document found ${id}`, 404));
    }
    

    res.status(204).send();
  });

exports.updateone = (model) =>
  asyncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError("document not found", 404));
    }
    // Trigger run save event when ubdate document to come in post(save) in review model
    document.save();
    res.status(200).json({ data: document });
  });
