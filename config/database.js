const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((conn) => {
      console.log(`DB connected : ${conn.connection.host}`);
    })
    // .catch((err) => {
    //   console.error(`DB connection failed : ${err}`);
    //   process.exit(1);
    // });
};

module.exports = dbConnection;
