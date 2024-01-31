const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room/roomController');
const auth = require("../middlewares/authMiddleware");

router.route('/')
    .get(roomController.getRooms)
    .post(auth.authMiddleware, auth.isAdmin, roomController.createRoom); // { name, description, prizePerNight, image }

router.route('/:id')
    .get(roomController.getRoom)
    .put(auth.authMiddleware, auth.isAdmin, roomController.updateRoom) // { name, description, prizePerNight, image }
    .delete(auth.authMiddleware, auth.isAdmin, roomController.deleteRoom);

module.exports = router;