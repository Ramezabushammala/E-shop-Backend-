const express = require("express");
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  GetLogedDataUser,
  UbdatepasswordLogedUser,
  UpdateDataLogedUser,
  DeleteLogedUser
} = require("../services/userServices");
const AuthServices = require("../services/authServices")
const {
  CreateUserValidator,
  GetUserValidator,
  UbdateUserValidator,
  DeleteUserValidator,
  ChangePasswordValidator,
  UbdateUserLogedDataValidator
} = require("../utils/validator/userValidator");

const router = express.Router();

//apply all route is below
router.use(AuthServices.protect);

//user
router.get("/getme",GetLogedDataUser,getUser);
router.put("/changemypassword",UbdatepasswordLogedUser)
router.put("/updateme",UbdateUserLogedDataValidator,UpdateDataLogedUser)
router.delete("/deleteme",DeleteLogedUser)
//admin
router.use(AuthServices.allowedTo("admin"));

router.route("/").post(CreateUserValidator, createUser).get(getUsers);
router.put("/changepassword/:id",ChangePasswordValidator,changeUserPassword);
router
  .route("/:id")
  .get(GetUserValidator, getUser)
  .put(UbdateUserValidator, updateUser)
  .delete(DeleteUserValidator,deleteUser);
module.exports = router;