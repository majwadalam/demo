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


exports.createOrder = async (req,res) => { 
  try {
    const { products, extraOptions, total, paymentMethod, email, clientSecret } = req.body;

    let order;

    if (paymentMethod === 'cod') {
      order = await Order.create({ products, extraOptions, total, email });
      return res.status(201).json(order);
    }

    if (paymentMethod === 'stripe') {
      const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);

      if (paymentIntent.status === 'succeeded') {
        order = await Order.create({ products, extraOptions, total, email });
        return res.status(201).json(order);
      }

      const payment = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: 'usd',
        payment_method: paymentIntent.payment_method,
        receipt_email: email,
      
      });

      if (payment.status === 'succeeded') {
        order = await Order.create({ products, extraOptions, total, email });
        return res.status(201).json(order);
      }
    }

    return res.status(400).json({ error: 'Invalid payment method' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

