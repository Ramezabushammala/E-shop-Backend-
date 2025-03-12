const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

// تحقق من القيمة هنا
const morgan = require("morgan"); //middlware
const dbConnection = require("./config/database");

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const mountRoutes = require("./routes");
const { WebhookCheckOut } = require("./services/orderServices");
// connect db
dbConnection();
//express app
const app = express();
app.set("trust proxy", 1);

//Enable others domains acsses to your application
app.use(cors());
app.options("*", cors());
//compress all response
app.use(compression());
//Checkout webhook
app.post('/webhook-checkout',express.raw({ type: 'application/json' }),WebhookCheckOut);
//   middleware
app.use(express.json({ limit: "20kb" })); // convert string from postman to json objact
app.use(express.urlencoded({ extended: true }));
//acsess static file in brwoser ==> http://localhost:8000/
app.use(express.static(path.join(__dirname, "uploads")));
//if (process.env.NODE_ENV = "development") {
// هذا الخطأ يعيّن القيمة بدلاً من التحقق منها
//}
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode is ${process.env.NODE_ENV}`);
}
// To remove data using these defaults:
app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "Too many accounts created from this ip , please again after 15 min",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
); //Express middleware to protect against HTTP Parameter Pollution attacks

//   Routes
mountRoutes(app);

// come in this code if not any route exiests
app.all("*", (req, res, next) => {
  // create error and send it to error handling middleware
  // const err = new Error(`can not find this route : ${req.originalUrl}`)
  //  next(err.message); // next to middleware aftar that
  next(new ApiError(`can not find this route : ${req.originalUrl}`, 400));
});

//handlig error this code know if there is error come here by express
//global error handling meddlware in express not all
app.use(globalError);

// app.get("/",(req,res)=>{
//    res.send("ramez")
// });

const { PORT } = process.env;

const server = app.listen(PORT||8000, () => {
  console.log(`server run is Port ${PORT}`);
  console.log("Current NODE_ENV:", process.env.NODE_ENV);
});
// Events => list => callback(err)
// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down ....`);
    process.exit(1);
  });
});
