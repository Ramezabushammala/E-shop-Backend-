const categoryRoute = require("./CategoryRoutes");
const subcategoryRoute = require("./SubCategoryRoutes");
const brandRoute = require("./BrandRoutes");
const prodactRoute = require("./ProdactRouts");
const userRoute = require("./UserRoutes");
const authRoute = require("./authRoutes");
const reviewRoute = require("./ReviewRoutes");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoutes");
const couponRoute = require("./CouponRoutes");
const cartRoute = require("./cartRoutes");
const orderRoute = require("./orderRoures");

const mountRoutes = (app)=>{
    app.use("/api/v1/categories", categoryRoute);
    app.use("/api/v1/subcategories",subcategoryRoute);
    app.use("/api/v1/brands",brandRoute);
    app.use("/api/v1/prodacts",prodactRoute);
    app.use("/api/v1/users",userRoute);
    app.use("/api/v1/auths",authRoute);
    app.use("/api/v1/reviews",reviewRoute);
    app.use("/api/v1/wishlist",wishlistRoute);
    app.use("/api/v1/addreses",addressRoute);
    app.use("/api/v1/coupons",couponRoute);
    app.use("/api/v1/carts",cartRoute);
    app.use("/api/v1/orders",orderRoute);
}

module.exports = mountRoutes ;