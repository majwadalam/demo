const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room/roomController');
const auth = require("../middlewares/authMiddleware");

router.route('/')
    .get( roomController.getRooms)
    .post( roomController.createRoom); // { name, description, prizePerNight, image, capacity }

router.route('/:id')
    .get(roomController.getRoom)
    .put( roomController.updateRoom) // { name, description, prizePerNight, image, capacity }
    .delete(roomController.deleteRoom);

module.exports = router;