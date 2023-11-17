const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { awardController } = require('../controllers/index');

router.post('/', upload.single('award_image'), async (req, res, next) => {
  try {
    await awardController.createAward(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Define a route to get an award by ID
router.get('/:id', async (req, res, next) => {
  try {
    await awardController.getAward(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Define a route to update an award by ID
router.put('/:id', upload.single('award_image'), async (req, res, next) => {
  try {
    await awardController.updateAward(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Define a route to delete an award by ID
router.delete('/:id', async (req, res, next) => {
  try {
    await awardController.deleteAward(req, res, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;