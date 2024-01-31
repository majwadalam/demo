const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require("../middlewares/authMiddleware");

// route for updating order 
router.put('/orders/:orderId/status', auth.authMiddleware, auth.isAdmin, orderController.updateOrderStatus);
router.post('/create-guest-payment-intent', orderController.createGuestPaymentIntent);
// Route for creating a new order
router.post('/createorder', orderController.createOrder);

// Route for retrieving all orders
router.get('/getorders', orderController.getallOrders);

// Route for retrieving a single order by ID
router.get('/:id', orderController.getOrderById);

// Route for updating an order by ID
router.put('/:id', orderController.updateOrderById);

// Route for deleting an order by ID
router.delete('/:id', orderController.deleteOrderById);

module.exports = router;
