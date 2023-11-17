const express = require('express');
// const {otpController,sociallinkedin,socialgoogle} = require('../controllers/index.js');
const { faqController } = require("../controllers/index.js");
const router = express.Router();

router.get('/', faqController.getFaqs);
router.get('/:id', faqController.getFaq);

router.post('/', async (req, res, next) => {
    try {
        await faqController.createFaq(req, res, next);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await faqController.updateFaq(req, res, next);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await faqController.deleteFaq(req, res, next);
    } catch (err) {
        next(err);
    }
});
module.exports = router;