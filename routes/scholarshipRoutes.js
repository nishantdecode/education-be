const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');

router.post('/', scholarshipController.create);
router.post('/all', scholarshipController.getAllScholarships);
router.post('/filter', scholarshipController.getFilterData);
router.get('/:id', scholarshipController.getScholarshipById);
router.put('/:id', scholarshipController.updateScholarship);
router.delete('/delete/:id', scholarshipController.deleteScholarship);

module.exports = router;
