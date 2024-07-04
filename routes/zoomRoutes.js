const express = require('express');
const router = express.Router();
const zoomController = require("../controllers/zoomController");

router.post('/create', zoomController.createAppointment);
router.get('/listmeetings', zoomController.listMeeting);
router.get('/getMeeting', zoomController.getMeeting);
router.post('/latest', zoomController.latestMeeting);
router.put('/update/:id', zoomController.updateMeeting);
router.delete('/delete/:id', zoomController.deleteMeeting);


module.exports = router;
