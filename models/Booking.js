const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        total: { type: Number, required: true },
        status: { type: String, enum: ['booked', 'checked-in', 'checked-out', 'cancelled'], default: 'booked' }
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;