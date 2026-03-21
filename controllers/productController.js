const Product = require("./../models/Product");
const AppError = require("./../utils/errorClass");
const catchAsync = require("./../utils/catchAsync");

//GET ALL THE PRODUCTS
exports.getAllProduct = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  return res.status(200).json({
    status: "success",
    data: {
      products,
    },
  });
});

//CREATING THE PRODUCTS

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);

  return res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

//GET THE PRODUCT BY THE ID

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  return res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

//UPDATE/PATCH THE PRODUCT

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

//DELETE THE PRODUCT

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.parans.id);

  return res.status(204).json({
    status: "success",
    data: null,
  });
});
