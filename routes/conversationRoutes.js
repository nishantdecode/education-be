const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

router.post('/', conversationController.getConversations);
router.post('/create', conversationController.create);

module.exports = router