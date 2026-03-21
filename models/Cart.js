const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A cart must belong to the user"],
    unique: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
