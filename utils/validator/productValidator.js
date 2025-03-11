const { check, body } = require("express-validator");
const  slugify  = require("slugify");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product requird")
    .custom((val, { req }) => {
          req.body.slug = slugify(val);
          return true
        }),
  check("description")
    .notEmpty()
    .withMessage("product description is required")
    .isLength({ max: 1000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold must be a number"),
  check("priceAftarDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAftarDiscount must be a number")
    .toFloat() // cheange to float 5.4 ex:
    .custom((value, { req }) => {
      //value is priceAftarDiscount الي معمول عليها check
      if (req.body.price <= value) {
        throw new Error("priceAftarDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be array of string"),
  check("imageCover").notEmpty().withMessage("product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    //value هي قيمة الفيلد الي معمول عليه check
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) throw new Error("category not found");
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (subcategoris) => {
      
      //$exists:true get all subcategoris in database $in:values get subcategories come in postman
       await SubCategoryModel.find({
        _id: { $exists: true, $in: subcategoris },
      }).then((results) => {
         // lengthe results equel
         //  lengthe subcategories in body
         //حصل على مصفوفة results، التي تحتوي فقط على الفئات الفرعية الموجودة في قاعدة البيانات.
         if (results.length !== subcategoris.length) {
          throw new Error("Invalid subcategories ids");
          }
      });
    }).custom(async(val,{req})=>{
       await SubCategoryModel.find({category:req.body.category}).then((subcategoris)=>{
        const subcategorisiddp = [];
        subcategoris.forEach((subcategori) => {
          subcategorisiddp.push(subcategori._id.toString());
          });
          // console.log(subcategorisiddp)
          //cheaker return true or false
          const cheaker = val.every((v)=> subcategorisiddp.includes(v));
          if(!cheaker) throw new Error("subcategories not belong to category");
      })
     }),
  
  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id")
  .isMongoId()
  .withMessage("Invalid ID formate"),
  body("title").optional()
  .custom((val,{req})=>{
    req.body.slug = slugify(val);
    return true ;
}),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
