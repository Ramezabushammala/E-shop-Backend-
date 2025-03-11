const { check, body } = require("express-validator");
const  slugify  = require("slugify");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");

exports.CreateSubCategoryValidetor = [
  check("name")
    .notEmpty()
    .withMessage("subCategory name is required")
    .isLength({ min: 2 })
    .withMessage("Too short subcategory name")
    .isLength({ max: 30 })
    .withMessage("Too long subcategory name")
    .custom((val, { req }) => {
          req.body.slug = slugify(val);
          return true
        }),
  check("category").notEmpty().withMessage("category is requird"),
  validatorMiddleware,
];

exports.getSubCategoryValidetor = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];

exports.ubdateSubCategoryValidetor =[
    check("id").isMongoId().withMessage("Invalid subcategory id format"),
     body("name").custom((val ,{req})=>{
                req.body.slug = slugify(val);
                return true ; // because next validation not stop her
          }),
    validatorMiddleware,
]
exports.deleteSubCategoryValidetor =[
    check("id").isMongoId().withMessage("Invalid subcategory id format"),
    validatorMiddleware,
]
