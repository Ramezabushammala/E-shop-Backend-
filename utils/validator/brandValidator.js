const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");

exports.CreateBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("brand name is required")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 30 })
    .withMessage("Too long brand name")
    .custom((value, { req }) => {
       req.body.slug = slugify(value);
       return true ; // important
    }),
  validatorMiddleware,
];

exports.GetBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
exports.UbdateBrandValidator = [
    check("id").isMongoId().withMessage("Invalid brand id format"),
    body("name").optional().custom((val ,{req})=>{
          req.body.slug = slugify(val);
          return true ; // because next validation not stop her
    }),
    validatorMiddleware,
  ];
  exports.DeleteBrandValidator = [
    check("id").isMongoId().withMessage("Invalid brand id format"),
    validatorMiddleware,
  ];
