const express = require('express');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');

router.post('/', advertisementController.createAdd);
router.get('/get', advertisementController.getAllAdvertisements);
router.post('/title', advertisementController.getAdvertisementByTitle);
router.get('/:id', advertisementController.getAdvertisementById);
router.put('/update/:id', advertisementController.updateAdvertisement);
router.delete('/delete/:id', advertisementController.deleteAdvertisement);

module.exports = router;
