const Order = require("./../models/Order");
const User = require("./../models/User");
const Product = require("./../models/Product");
const Cart = require("./../models/Cart");
const AppError = require("./../utils/errorClass");
const catchAsync = require("./../utils/catchAsync");

exports.getOrders = catchAsync(async (req, res, next) => {
  //find the user
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(new AppError("There is no order with that user id", 400));
  }

  return res.status(200).json({
    status: success,
    data: {
      orders,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  // 1. Get user cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  // 2. Prepare order items
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    // push snapshot data
    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price, // 🔥 snapshot
    });
  }

  // 3. Calculate total price
  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  // 4. Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalPrice,
  });

  // 5. Clear cart
  await Cart.findOneAndDelete({ user: userId });

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.orderId);

  if (!order) {
    return next(new AppError("There is no error with that id", 400));
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError("There is no error with that id", 400));
  }

  return res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});
