const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

router.post('/partners', partnerController.createAdd);
router.get('/partners', partnerController.getAllPartners);
router.get('/partners/:id', partnerController.getPartnerById);
router.put('/partners/:id', partnerController.updatePartner);
router.delete('/partners/:id', partnerController.deletePartner);

module.exports = router;
