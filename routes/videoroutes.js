// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/add', videoController.addVideo);
router.put('/update/:id', videoController.updateVideo);
router.get('/videos', videoController.getAllVideos);

module.exports = router;
