const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/room/reviewController');

router.route('/')
    .get(reviewController.getReviews)
    .post(reviewController.createReview); // { rating, comment, bookingId }

router.route('/:id')
    .get(reviewController.getReview)
    .put(reviewController.updateReview) // { rating, comment }
    .delete(reviewController.deleteReview);

module.exports = router;
