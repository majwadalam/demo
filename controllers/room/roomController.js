const Room = require("../../models/Room");

// All funtions
// 1. Get all rooms
// 2. Get single room
// 3. Create room
// 4. Update room
// 5. Delete room
// 6. Get rooms by keyword

// Get all rooms
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get single room
exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create room
exports.createRoom = async (req, res) => {
    try {
        const { name, description, pricePerNight, image, capacity } = req.body;

        // Validate input fields
        if (!name || !description || !pricePerNight || !image || !capacity) {
            return res
                .status(400)
                .json({ message: "Please fill out all required fields" });
        }

        const room = await Room.create(req.body);
        res.status(201).json({ room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update room
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const { name, description, pricePerNight, image , capacity} = req.body;

        // Validate input fields
        if (!name || !description || !pricePerNight || !image || !capacity) {
            return res
                .status(400)
                .json({ message: "Please fill out all required fields" });
        }

        await room.updateOne(req.body);
        res.status(200).json({ message: "Room updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.deleteOne();
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get rooms by keyword
exports.getRoomsByKeyword = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: "i",
                  },
              }
            : {};

        const rooms = await Room.find({ ...keyword });
        res.status(200).json({ rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};