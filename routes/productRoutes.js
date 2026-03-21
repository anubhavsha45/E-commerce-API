const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const productController = require("./../controllers/productController");

router
  .route("/")
  .get(productController.getAllProduct)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    productController.createProduct,
  );

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteProduct,
  );
