const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');

// Create a scholarship
router.post('/', scholarshipController.create);

// Get all scholarships
router.get('/', scholarshipController.getAllScholarships);

// Get a scholarship by ID
router.get('/:id', scholarshipController.getScholarshipById);

// Update a scholarship by ID
router.put('/:id', scholarshipController.updateScholarship);

// Delete a scholarship by ID
router.delete('/delete/:id', scholarshipController.deleteScholarship);

module.exports = router;
