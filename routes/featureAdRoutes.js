// routes/featureAdRoutes.js
const express = require('express');
const router = express.Router();
const featureAdController = require('../controllers/featureAdController');

router.post('/', featureAdController.create);
router.get('/', featureAdController.getAllFeatureAds);
router.get('/:id', featureAdController.getFeatureAdById);
router.put('/:id', featureAdController.updateFeatureAd);
router.delete('/:id', featureAdController.deleteFeatureAd);
router.get('/type/:type', featureAdController.getAllFeatureAdsByType);

module.exports = router;
