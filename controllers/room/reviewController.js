const Review = require('../../models/review');
const Booking = require('../../models/Booking');

// All funtions
// 1. Get all reviews
// 2. Get single review
// 3. Create review
// 4. Update review
// 5. Delete review

// Get all reviews
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get single review
exports.getReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create review
exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { bookingId } = req.params;
        const user = req.user._id;

        // Validate input fields
        if (!rating || !comment) {
            return res
                .status(400)
                .json({ message: 'Please fill out all required fields' });
        }

        // Check if booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if booking is already reviewed
        const alreadyReviewed = Review.find({
            booking: bookingId,
            user,
        })

        if (alreadyReviewed) {
            return res
                .status(400)
                .json({ message: 'Booking already reviewed' });
        }

        // Check if booking belongs to user
        if (booking.user.toString() !== user.toString()) {
            return res
                .status(401)
                .json({ message: 'Not authorized to create review' });
        }

        // Check if booking is checked out
        if (booking.status !== 'checked-out') {
            return res.status(400).json({
                message: 'Booking must be checked out before submitting a review',
            });
        }

        // Create review
        const review = await Review.create({
            rating,
            comment,
            user,
            room: booking.room,
        });

        // Add review to booking
        booking.reviews.push(review._id);
        await booking.save();

        res.status(201).json({ review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update review
exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        } else if (review.user.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ message: 'You are not authorized to update this review' });
        }

        const { rating, comment } = req.body;

        // Validate input fields
        if (!rating || !comment) {
            return res
                .status(400)
                .json({ message: 'Please fill out all required fields' });
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.status(200).json({ review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        } else if (review.user.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ message: 'You are not authorized to delete this review' });
        }

        await review.remove();

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};