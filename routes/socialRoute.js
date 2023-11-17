const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');

router.post('/socials', socialController.createAdd);
router.get('/socials', socialController.getAllSocials);
router.get('/socials/:id', socialController.getSocialById);
router.put('/socials/:id', socialController.updateSocial);
router.delete('/socials/:id', socialController.deleteSocial);

module.exports = router;
