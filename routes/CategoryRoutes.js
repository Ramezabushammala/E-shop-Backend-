const express = require("express");

const {
  getCategories,
  getSpesificCategory,
  updateCategory,
  DeleteCategory,
  createCategory,
  uploadCategoryimage,
  resizeImage,
} = require("../services/categoryServices");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");
const subcategoryRoute = require("./SubCategoryRoutes");
const AuthServices = require("../services/authServices");

const router = express.Router();
//router.use() يتم استخدامه لتمرير أي طلب يبدأ بالمسار المحدد إلى subcategoryRoute.
router.use("/:categoryId/subcategories", subcategoryRoute);
// router.get('/',getCategory)
// router.post('/',createCategory);
// اختصار
// finds the validation error in the request before acsess database
router.use(AuthServices.protect,AuthServices.allowedTo("admin", "manger"))
router
  .route("/")
  .get(getCategories)
  .post( 
    uploadCategoryimage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getSpesificCategory)
  .put(
    uploadCategoryimage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    deleteCategoryValidator,
    DeleteCategory
  );
module.exports = router;
