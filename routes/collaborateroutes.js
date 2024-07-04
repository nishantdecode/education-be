const express = require('express');
const router = express.Router();
const {
    collaborate
} = require('../controllers/collaborateController');

router.post('/submit', collaborate);

module.exports = router;
