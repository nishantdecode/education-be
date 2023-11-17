const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { bannerController } = require('../controllers/index');

router.post('/', upload.single('banner_image'), async (req, res, next) => {
    try {
        await bannerController.createBanner(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

// Define a route to get an award by ID
router.get('/:id', async (req, res, next) => {
    try {
        await bannerController.getBanner(req, res, next)
    } catch (err) {
        next(err);
    }
}
);
// Define a route to update an award by ID
router.put('/:id', upload.single('banner_image'), async (req, res, next) => {
    try {
        await bannerController.updateBanner(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

// Define a route to delete an award by ID
router.delete('/:id', async (req, res, next) => {
    try {
        await bannerController.deleteBanner(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

module.exports = router;