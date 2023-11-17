const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');

router.post('/advertisements', advertisementController.createAdd);
router.get('/advertisements', advertisementController.getAllAdvertisements);
router.get('/advertisements/:id', advertisementController.getAdvertisementById);
router.put('/advertisements/:id', advertisementController.updateAdvertisement);
router.delete('/advertisements/:id', advertisementController.deleteAdvertisement);

module.exports = router;
