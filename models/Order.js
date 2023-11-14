const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  customerInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: Number,
      img1: String,
    },
  ],
  orderTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: String,
  delivery: String,
});

module.exports = mongoose.model("Order", orderSchema);
