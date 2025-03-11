const { check, body } = require("express-validator");
const slugify = require("slugify");
const  bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");
const userModel = require("../../models/userModel");

exports.SignUpValidator = [
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

  validatorMiddleware,
];


exports.LoginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Invalid Email Format"),

    check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("Too short Password"),
    validatorMiddleware,
   
]