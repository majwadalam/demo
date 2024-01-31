const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    extraOptions: [
      {
        text: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ['stripe', 'cod', "cash", "card"], // Payment method can be "stripe" or "cod"
    },
    address: {
      type: String,
    },
  
    email: {
      type: String,
    },
    size: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
      enum: ['preparing', 'shipped', 'delivered'], // Order status can be "pending", "shipped", or "delivered"
      default: 'preparing', // Set default status to "pending"
    },
    email: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
 
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
