const Cart = require("./../models/Cart");
const Product = require("./../models/Product");
const AppError = require("./../utils/errorClass");
const catchAsync = require("./../utils/catchAsync");

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // check product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create new cart
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }],
    });
  } else {
    // check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      // product exists → increase quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // add new product
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.updateQuantity = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    return next(new AppError("Product not in cart", 404));
  }

  item.quantity = quantity;

  await cart.save();

  res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.clearCart = catchAsync(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
