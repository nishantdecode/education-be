// userRoutes.js
const express = require('express');
const router = express.Router();
const {
    collaborate
} = require('../controllers/collaborateController');

// submit route
router.post('/submit', collaborate);

module.exports = router;
