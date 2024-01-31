const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require("../middlewares/authMiddleware");

// route for updating order 
router.put('/orders', auth.authMiddleware, auth.isAdmin, orderController.updateOrderStatus);
// Route for creating a new order
router.post('/createorder',auth.authMiddleware,orderController.createOrder);

// Route for retrieving all orders
router.get('/getorders', orderController.getAllOrders);

//http://localhost:3001/api/orders/getorders?page=1&pageSize=10
// Route for retrieving a single order by ID
router.get('/orders/:orderId', orderController.getOrderById);
// Route for updating an order by ID
router.put('updateorder/:id', orderController.updateOrderById);

// Route for deleting an order by ID
router.delete('/:id', orderController.deleteOrderById);

//route for editing status
router.put('/editstatus/:id', orderController.editOrderStatus);

//router for getting a users orders
router.get('/usersorders/:id', orderController.getOrdersByUser);
//order count
router.get('/orderscount',orderController.getAllOrdersCount);

module.exports = router;
