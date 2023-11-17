const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { partnershipController } = require('../controllers/index');

router.post('/', upload.any(), async (req, res, next) => {
    try {
        await partnershipController.createPartnership(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

//Define a route to get an award by ID
router.get('/:id', async (req, res, next) => {
    try {
        await partnershipController.getPartnership(req, res, next)
    } catch (err) {
        next(err);
    }
}
);
// Define a route to update an award by ID
router.put('/:id', upload.any(), async (req, res, next) => {
    try {
        await partnershipController.updatePartnership(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

// Define a route to delete an award by ID
router.delete('/:id', async (req, res, next) => {
    try {
        await partnershipController.deletePartnership(req, res, next)
    } catch (err) {
        next(err);
    }
}
);

module.exports = router;