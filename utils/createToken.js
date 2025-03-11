const jwt = require("jsonwebtoken");

exports.CreteToken = (payload)=>{
    // genrate token
      const token = jwt.sign({ userid: payload }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });
      return token;
}