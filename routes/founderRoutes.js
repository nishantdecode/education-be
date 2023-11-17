// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const founderController = require('../controllers/founderController');

router.post('/add', founderController.add);
router.put('/update/:id', founderController.updateFounder);
router.get('/founders', founderController.getAllFounders);

module.exports = router;
