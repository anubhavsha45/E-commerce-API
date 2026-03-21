const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const cartController = require("./../controllers/cartController");

router.use(authController.protect);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);

router.patch("/:productId", cartController.updateQuantity);
router.delete("/:productId", cartController.removeFromCart);

router.delete("/", cartController.clearCart);
