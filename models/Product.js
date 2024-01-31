const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
    required: true,
  }],
  description : { 
    type : String, 
    required : true,
  },
  prices: {
    type: [Number],
    required: true,
  },
  extraOptions: {
    type: [
      {
        text: { type: String},
        price: { type: Number},
      },
    ],
  },
  category: {
    type: String,
  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;