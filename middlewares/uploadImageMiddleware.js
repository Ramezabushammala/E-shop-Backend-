const multer = require("multer");
const ApiError = require("../utils/apiError");


 const settingStoreageMulterOption = ()=>{
    //use memoryStorege to accsess buffer to use sharp prossing image user parmetar req.file.buffer
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Not an image! Please upload only images.", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload ;
 }
//  const upload = settingStoreageMulterOption();

exports.uploadSingleImage = (filedname) => settingStoreageMulterOption().single(filedname);

exports.uploadMixofImages = (arrayoffildes)=> settingStoreageMulterOption().fields(arrayoffildes);

//diskStorege no accsess buffer
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     //first parmetaer in cb error null error
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     //create uniqe filename
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });