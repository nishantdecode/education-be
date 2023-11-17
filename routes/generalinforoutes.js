const express = require('express');
const router = express.Router();
const generalinfoController = require('../controllers/generalinfoController');

router.post('/generalinfos', generalinfoController.createAdd);
router.get('/generalinfos', generalinfoController.getAllGeneralinfos);
router.get('/generalinfos/:id', generalinfoController.getGeneralinfoById);
router.put('/generalinfos/:id', generalinfoController.updateGeneralinfo);

module.exports = router;
