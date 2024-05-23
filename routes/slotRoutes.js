const express = require('express');
const router = express.Router();
const SlotController = require('../controllers/slotController');

router.get('/', SlotController.getAllSlots);
router.post('/create', SlotController.create);
router.post('/date', SlotController.getAllSlotsByDate);
router.put('/book', SlotController.updateSlot);
router.delete('/delete', SlotController.deleteSlot);
router.get('/:slotId', SlotController.getSlot);

module.exports = router;
