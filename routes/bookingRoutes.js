const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/room/bookingsController');
const auth = require("../middlewares/authMiddleware");

router.route('/')
    .get(bookingController.getAllBookings)
    .post(auth.authMiddleware, bookingController.createBooking);

router.route('/:id')
    .get(bookingController.getBookingById)
    .put(auth.authMiddleware, bookingController.updateBookingById)
    .delete(auth.authMiddleware, bookingController.deleteBookingById);

router.route('/check-in/:id')
    .put(auth.authMiddleware, bookingController.checkin);

router.route('/check-out/:id')
    .put(auth.authMiddleware, bookingController.checkout);

router.route('/cancel')
    .put(auth.authMiddleware, bookingController.cancelBooking);

module.exports = router;
