const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const orderController = require("./../controllers/orderController");

router.use(authController.protect);
router
  .route("/")
  .get(orderController.getOrders)
  .post(orderController.createOrder);

router.use(authController.restrictTo("admin"));

router
  .route(":/orderId")
  .delete(orderController.deleteOrder)
  .patch(orderController.updateOrder);

module.exports = router;
