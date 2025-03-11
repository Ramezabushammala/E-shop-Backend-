const { check, body } = require("express-validator");
const slugify = require("slugify");
const  bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");
const userModel = require("../../models/userModel");

exports.CreateUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("Too short name user")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already exixts"));
        }
      })
    ),

  check("profileimage").optional(),

  check("phone")
    .optional()
    .isNumeric()
    .withMessage("number be should Integar")
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("number not Egept or palstine"),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Too short Password")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required"),

  check("role").optional(),
  validatorMiddleware,
];
exports.GetUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
exports.UbdateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already exixts"));
        }
      })
    ),

    check("phone")
    .optional()
    .isNumeric()
    .withMessage("number be should Integar")
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("number not Egept or palstine"),

 check("profileimage").optional(),
 check("role").optional(),
  validatorMiddleware,
];
exports.ChangePasswordValidator =[
  check("id")
  .isMongoId()
  .withMessage("Invalid User id format"),
  body("currentPassword")
  .notEmpty()
  .withMessage("you must enter currentPassword"),
  body("password")
  .notEmpty()
  .withMessage("you must enter password")
  .custom(async(val,{req})=>{
     const user = await userModel.findById(req.params.id);
     if(!user){
      throw new Error ("There is no user for this id")
     }
    //isCorrectPassword return true or false
 const isCorrectPassword =  await bcrypt.compare(req.body.currentPassword,user.password)
 if(!isCorrectPassword){
  throw new Error("Incorrect Current Password")
  }
  return true;
  }),
  body("confirmpassword")
  .notEmpty()
  .withMessage("you must enter ConfirmPassword")
  .custom((val,{req})=>{
      if(req.body.password !== val){
        throw new Error ("confirmpassword incorrect")
      }
      return true ;
  }),
  validatorMiddleware,
]
exports.DeleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.UbdateUserLogedDataValidator = [
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already exixts"));
        }
      })
    ),

    check("phone")
    .optional()
    .isNumeric()
    .withMessage("number be should Integar")
    .isMobilePhone(["ar-EG", "ar-PS"])
    .withMessage("number not Egept or palstine"),
    
  validatorMiddleware,
];