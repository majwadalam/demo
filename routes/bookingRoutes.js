const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/room/bookingController');
const auth = require("../middlewares/authMiddleware");

router.route('/')
    .get(bookingController.getBookings)
    .post(auth.authMiddleware, bookingController.createBooking); // { room, checkIn, checkOut }
  
    router.get("/getuserbookings", auth.authMiddleware, bookingController.getuserbookings);



router.route('/:id')
    .put(auth.authMiddleware, bookingController.updateBooking) // { room, checkIn, checkOut }
    .delete(auth.authMiddleware, bookingController.deleteBooking);

router.route('/check-in/:id')
    .put(auth.authMiddleware, bookingController.checkin);

router.route('/check-out/:id')
    .put(auth.authMiddleware, bookingController.checkout);

router.route('/cancel')
    .put(auth.authMiddleware, bookingController.cancelBooking);



module.exports = router;
