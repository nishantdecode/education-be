const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { mediaController } = require('../controllers/index');

router.post('/', upload.single('media_image'), async (req, res, next) => {
    try {
        await mediaController.createMedia(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

// Define a route to get an award by ID
router.get('/:id', async (req, res, next) => {
    try {
        await mediaController.getMedia(req, res, next)
    } catch (err) {
        next(err);
    }
}
);
// Define a route to update an award by ID
router.put('/:id', upload.single('media_image'), async (req, res, next) => {
    try {
        await mediaController.updateMedia(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

// Define a route to delete an award by ID
router.delete('/:id', async (req, res, next) => {
    try {
        await mediaController.deleteMedia(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

module.exports = router;