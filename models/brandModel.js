const mongoose = require("mongoose");


const BrandSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Brand required"],
        unique:[true,"Brand should be uniqe"],
        trim:true,
        minlength:[3,"Too short category name"], //min number name category
        maxlength:[30,"Too long category name"],
    },
    image:String,
    slug:{
        type : String ,
        lowercase:true,
    }

},{timestamps:true})

const setImageUrl = (doc)=>{
    if(doc.image){
        const imageUrl =`${process.env.BASE_URL}/brands/${doc.image}`
        doc.image = imageUrl;
    }
}
// run in getAll , getone, ubdate
BrandSchema.post('init', (doc)=> {
    //doc is data return after init in db 
     setImageUrl(doc);
  });

 //run in cretate category time save doc in db
 BrandSchema.post('save', (doc)=> {
    //doc is data return after save in db 
   setImageUrl(doc);
  });

const BrandModel = mongoose.model("Brand",BrandSchema);

module.exports = BrandModel ;