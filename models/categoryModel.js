const mongoose = require("mongoose");
 
 //Create schema
 const categorySchema =new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Category required"],
        unique: [true, "Category should be uniqe"], // uniqe categor in api
        minlength:[3,"Too short category name"], //min number name category
        maxlength:[30,"Too long category name"],
    },
    // A and B ===== shoping.com/a-and-b بعوض المسافة ب سلاش ويجعلها سمول لتر 
    slug:{
        type : String ,
        lowercase:true,
    },
     image:String,
},{timestamps:true});

const setImageUrl = (doc)=>{
    if(doc.image){
        const imageUrl =`${process.env.BASE_URL}/categories/${doc.image}`
        doc.image = imageUrl;
    }
}
// run in getAll , getone, ubdate
categorySchema.post('init', (doc)=> {
    //doc is data return after init in db 
     setImageUrl(doc);
  });

 //run in cretate category time save doc in db
  categorySchema.post('save', (doc)=> {
    //doc is data return after save in db 
   setImageUrl(doc);
  });
  // Create model to oppartion on schema like save or add or update
const CategoryModel = mongoose.model('category',categorySchema);

module.exports = CategoryModel;