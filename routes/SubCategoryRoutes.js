const express = require("express");
const {
  CreateSubCategory,
  getSubCategorys,
  getSubCategory,
  UpdateSubCategory,
  DeleteSubCategory,
  setCategoryIdToBody,
  createFilterBbj,
} = require("../services/subCategoryServices");
const AuthServices = require("../services/authServices");
const {
  CreateSubCategoryValidetor,
  getSubCategoryValidetor,
  ubdateSubCategoryValidetor,
} = require("../utils/validator/subCategoryValidator");
const {
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");
// mergeParams allow us to acsses paramters on other routers
//ex : to neednto accsess categoryId from category route
const router = express.Router({ mergeParams: true });
router.use(AuthServices.protect, AuthServices.allowedTo("admin", "manger"));
router
  .route("/")
  .post(
    setCategoryIdToBody,
    CreateSubCategoryValidetor,
    CreateSubCategory
  )
  .get(createFilterBbj, getSubCategorys);
router
  .route("/:id")
  .get(getSubCategoryValidetor, getSubCategory)
  .put(
    ubdateSubCategoryValidetor,
    UpdateSubCategory
  )
  .delete(
    deleteCategoryValidator,
    DeleteSubCategory
  );
module.exports = router;
