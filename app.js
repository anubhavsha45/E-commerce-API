const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
//body parser
app.use(express.json());
//mounted routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/products", productRoutes);
//exporting the app
module.exports = app;
