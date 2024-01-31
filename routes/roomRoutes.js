const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room/roomController');
const auth = require("../middlewares/authMiddleware");

// router.route('/')
//     .get(roomController.getAllRooms)
//     .post(auth.authMiddleware, auth.isAdmin, roomController.createRoom);

// router.route('/:id')
//     .get(roomController.getRoomById)
//     .put(auth.authMiddleware, auth.isAdmin, roomController.updateRoomById)
//     .delete(auth.authMiddleware, auth.isAdmin, roomController.deleteRoomById);

router.route('/').get(() => {
    console.log('hello')
})

module.exports = router;