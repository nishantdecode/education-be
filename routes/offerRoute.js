const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');

router.post('/offers', offerController.createAdd);
router.get('/offers', offerController.getAllOffers);
router.get('/offers/:id', offerController.getOfferById);
router.put('/offers/:id', offerController.updateOffer);
router.delete('/offers/:id', offerController.deleteOffer);

module.exports = router;
