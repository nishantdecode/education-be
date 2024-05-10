const express = require('express');
const multer = require('multer');
const router = express.Router();
const advertisementController = require('../controllers/advertisementController');
const storage = require("../middlewares/upload/uploadFile");

const upload = multer({ storage });

// router.post('/post', upload.single('image'), advertisementController.createAdd);
router.post('/', advertisementController.createAdd);
router.get('/get', advertisementController.getAllAdvertisements);
router.post('/title', advertisementController.getAdvertisementByTitle);
router.get('/:id', advertisementController.getAdvertisementById);
router.put('/update/:id', advertisementController.updateAdvertisement);
router.delete('/delete/:id', advertisementController.deleteAdvertisement);

module.exports = router;
