const Order = require('../models/Order');
const stripe = require('stripe')("sk_test_51Mi0m8GPZSkTDyyD6wRzzFRjWBnDiN5oHcf9UqcjsjLOaflZWb1oRBW13KZAUHF8g0ZYxKbdCQuXZ6QOoiAsJepf00gBgPYIZI"); // Import the Stripe module and set the secret key





exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('user', 'name email');
        res.json(orders);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
      }
  // ...
};

exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  // ...
};

exports.updateOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ error: 'Order has already been paid' });
      }
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { $set: req.body },
        { new: true }
      );
      res.json(updatedOrder);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  // ...
};

exports.deleteOrderById = async (req, res) => {


    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      if (order.paymentStatus === 'paid') {
        return res.status(400).json({ error: 'Order has already been paid' });
      }
      await Order.findByIdAndDelete(orderId);
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
};


exports.updateOrderStatus = async( req,res) => { 
    const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: 'Order has not been paid yet' });
    }
    order.status = status;
    await order.save();
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  };


}


exports.getallOrders = async(req,res) =>  { 

  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    
    res.status(500).json({ message: err.message });
  }


}


 exports.createGuestPaymentIntent = async (req,res) => {

  try {
    const { total, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // Amount in cents
      currency: 'usd',
      receipt_email: email,
      payment_method_types: ['card'],
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create payment intent for guest' });
  }


};


exports.createOrder = async (req, res) => {
  try {
    const {
      products,
      extraOptions,
      paymentMethod,
      email,
      size,
    } = req.body;

    // Calculate total price including products and extraOptions
    let totalPrice = 0;

    // Calculate total price for products
    for (const product of products) {
      totalPrice += product.price * product.quantity;
    }

    // Calculate total price for extraOptions
    for (const option of extraOptions) {
      totalPrice += option.price * option.quantity;
    }

    // Create the order object
    const order = new Order({
      products,
      extraOptions,
      paymentMethod,
      email,
      size,
      totalPrice,
      status: 'preparing', // Set default status to "preparing"
      userId: req.user._id, // Assuming you have authentication middleware setting req.user
    });

    // Save the order to the database
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};