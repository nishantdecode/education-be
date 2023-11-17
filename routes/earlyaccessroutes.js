const express = require('express');
const router = express.Router();
const earlyAccessController = require('../controllers/earlyAccessController');

router.post('/submit', earlyAccessController.submit);
router.get('/submissions', earlyAccessController.getAllSubmissions);

module.exports = router;
