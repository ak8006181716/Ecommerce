const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
require('dotenv').config({ path: './.env' });

//create a database connection -> u can also
//create a separate file for this and then import/use that file here


mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Databse connected successfull");
    
  })
  .catch((error) => {});

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "https://ecommerce-self-pi-99.vercel.app", // production
  "https://ecommerce-gn1tgfofu-ak8006181716s-projects.vercel.app", // preview,
  "http://localhost:5174"
];

app.use(
  cors({
     origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    //  origin: (origin, callback) => {
    //   if (!origin || /vercel\.app$/.test(origin)) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error("Not allowed by CORS"));
    //   }
    // },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);
app.get("/",(req,res)=>{
  res.send("hello from server")
})
app.listen(PORT, () => {
  console.log(`Server is now running on port${PORT}`);
  
});
