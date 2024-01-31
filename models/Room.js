const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        pricePerNight: { type: Number, required: true },
        status: { type: String, enum: ['available', 'unavailable'], default: 'available' }
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;