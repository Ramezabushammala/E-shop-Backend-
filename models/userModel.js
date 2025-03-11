const  bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      unique: [true, "email should be uniqe"],
      lowercase: true,
    },
    phone: String,
    profileimage: String,
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password Too short"],
    },
    TimeChangePassword:Date,
    randomCodehash:String,
    passwordResetCodeExpire:Date,
    passwordVerifieRestCode:Boolean,
    role: {
      type: String,
      enum: ["admin","manger","user"], // just one for this array
      default: "user",
    },
    active: {
      type: Boolean,
    },
    //child refurnse one to many ==== parent ref in revieww model parent product wishlist little ===> review large
    wishlist:[{
      type:mongoose.Schema.ObjectId,
       ref:"product"
    }],

    //Empeded relationship no seprarate Collection just like type:mongoose.Schema.ObjectId , ref:"user"
   AdressesUser:[
    {
     id: {type : mongoose.Schema.Types.ObjectId},
     alias:String,
     details:String,
     phone:String,
     city:String,
     postalCode:String
    }
  ]
  },
  { timestamps: true }
);
   
// exquite befor save in data base 
  userSchema.pre("save",async function(next){
   // اذا لم يحدث تغيير 
   if(!this.isModified('password')) return next();
    // hashing user password 
    this.password= await bcrypt.hash(this.password,12);
    next();
  })

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
