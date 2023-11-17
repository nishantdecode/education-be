const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.post('/newss', newsController.createAdd);
router.get('/newss', newsController.getAllNewss);
router.get('/newss/:id', newsController.getNewsById);
router.put('/newss/:id', newsController.updateNews);
router.delete('/newss/:id', newsController.deleteNews);

module.exports = router;
