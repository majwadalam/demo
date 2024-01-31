const Room = require("../../models/Room.js");
const Booking = require("../../models/Booking.js");

// All funtions
// 1. Get all bookings
// 2. Get single booking
// 3. Create booking
// 4. Update booking
// 5. Delete booking
// 6. Cancel booking
// 7. Check-in
// 8. Check-out

// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get single booking
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({ booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const { room, checkIn, checkOut } = req.body;
        const user = req.user._id;

        // Validate input fields
        if (!room || !checkIn || !checkOut) {
            return res
                .status(400)
                .json({ message: "Please fill out all required fields" });
        } else if (checkIn > checkOut) {
            return res
                .status(400)
                .json({ message: "Check-in date cannot be after check-out date" });
        }

        // Calculate number of nights
        const oneDay = 24 * 60 * 60 * 1000;
        const numberOfNights = Math.round(
            Math.abs((checkIn - checkOut) / oneDay)
        );

        // Fetch room price
        const roomData = await Room.findById(room);
        const pricePerNight = roomData.pricePerNight;

        // Calculate total price
        const total = pricePerNight * numberOfNights;

        // Create booking
        const booking = await Booking.create({
            room,
            user,
            checkIn,
            checkOut,
            total,
        });

        roomData.status = "unavailable";
        await roomData.save();

        res.status(201).json({ booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update booking
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        } else if (booking.user.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ message: "You are not authorized to update this booking" });
        }

        const { room, checkIn, checkOut } = req.body;

        // Validate input fields
        if (!room || !checkIn || !checkOut) {
            return res
                .status(400)
                .json({ message: "Please fill out all required fields" });
        } else if (checkIn > checkOut) {
            return res
                .status(400)
                .json({ message: "Check-in date cannot be after check-out date" });
        }

        // Calculate number of nights
        const oneDay = 24 * 60 * 60 * 1000;
        const numberOfNights = Math.round(
            Math.abs((checkIn - checkOut) / oneDay)
        );

        // Fetch room price
        const roomData = await Room.findById(room);
        const pricePerNight = roomData.pricePerNight;

        // Calculate total price
        const total = pricePerNight * numberOfNights;

        // Update booking
        booking.room = room;
        booking.checkIn = checkIn;
        booking.checkOut = checkOut;
        booking.total = total;
        await booking.save();

        res.status(200).json({ booking: booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.remove();
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        } else if (booking.user.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ message: "You are not authorized to cancel this booking" });
        }

        const room = await Room.findById(booking.room);
        room.status = "available";
        await room.save();

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.checkin = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        } else if (booking.user.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ message: "You are not authorized to check-in this booking" });
        }

        booking.status = "checked-in";
        await booking.save();

        res.status(200).json({ message: "Checked-in successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.checkout = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        } else if (booking.user.toString() !== req.user._id.toString()) {
            return res
                .status(401)
                .json({ message: "You are not authorized to check-out this booking" });
        }

        booking.status = "checked-out";
        await booking.save();

        res.status(200).json({ message: "Checked-out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};