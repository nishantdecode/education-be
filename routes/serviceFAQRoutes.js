// routes/serviceFAQRoutes.js
const express = require('express');
const router = express.Router();
const serviceFAQController = require('../controllers/serviceFAQController');

router.post('/', serviceFAQController.create);
router.get('/get', serviceFAQController.getAllServiceFAQs);
router.get('/:id', serviceFAQController.getServiceFAQById);
router.put('update/:id', serviceFAQController.updateServiceFAQ);
router.delete('delete/:id', serviceFAQController.deleteServiceFAQ);
router.get('/type/:type', serviceFAQController.getAllServiceFAQsByType);

module.exports = router;
