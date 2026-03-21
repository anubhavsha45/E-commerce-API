const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have a name"],
    trim: true,
  },

  price: {
    type: Number,
    required: [true, "Product must have a price"],
  },

  description: {
    type: String,
    required: [true, "Product must have a description"],
  },

  category: {
    type: String,
    required: [true, "Product must belong to a category"],
  },

  stock: {
    type: Number,
    required: [true, "Product must have stock"],
    default: 0,
  },

  images: [
    {
      type: String, // store image URLs
    },
  ],

  ratingsAverage: {
    type: Number,
    default: 4.5,
  },

  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
