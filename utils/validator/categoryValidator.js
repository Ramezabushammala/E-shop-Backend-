const { check, body } = require("express-validator");
const  slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");

//add rules يتم التحقق من صحة id أولاً قبل الوصول إلى getSpesificCategory
//   param("id").isMongoId().withMessage("Invalid category id");
exports.getCategoryValidator = [
  // check all thing param and body and queri and ...
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
exports.createCategoryValidator = [
  // no validate on uniqe becuase before database i want not acsses database
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 30 })
    .withMessage("Too long category name")
     .custom((val, { req }) => {
          req.body.slug = slugify(val);
          return true
        }),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
   body("name").optional().custom((val ,{req})=>{
            req.body.slug = slugify(val);
            return true ; // because next validation not stop her
      }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
