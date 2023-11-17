// routes/coachingRoutes.js
const express = require('express');
const router = express.Router();
const coachingController = require('../controllers/coachingController');

router.post('/', coachingController.create);
router.get('/', coachingController.getAllCoachings);
router.get('/:id', coachingController.getCoachingById);
router.put('/:id', coachingController.updateCoaching);
router.delete('/delete/:id', coachingController.deleteCoaching);

module.exports = router;
