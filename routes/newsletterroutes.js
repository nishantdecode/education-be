const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

router.post('/apply', newsletterController.apply);
router.get('/applications', newsletterController.applications);

module.exports = router;
