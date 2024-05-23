const express = require('express');
const router = express.Router();
const zoomController = require("../controllers/zoomController");

router.post('/create', zoomController.CreateAppointment);
router.get('/listmeetings', zoomController.ListMeeting);
router.get('/getMeeting', zoomController.getMeeting);
router.get('/latest', zoomController.latestMeeting);


module.exports = router;
