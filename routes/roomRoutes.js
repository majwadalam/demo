const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room/roomController');
const auth = require("../middlewares/authMiddleware");

router.route('/')
    .get(auth.authMiddleware, auth.isAdmin, roomController.getRooms)
    .post(auth.authMiddleware, auth.isAdmin, roomController.createRoom); // { name, description, prizePerNight, image, capacity }

router.route('/:id')
    .get(roomController.getRoom)
    .put(auth.authMiddleware, auth.isAdmin, roomController.updateRoom) // { name, description, prizePerNight, image, capacity }
    .delete(auth.authMiddleware, auth.isAdmin, roomController.deleteRoom);

module.exports = router;