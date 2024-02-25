// routes/collegeRoutes.js
const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');

router.post('/', collegeController.create);
router.post('/import', collegeController.importCollegeData);
router.get('/', collegeController.getAllColleges);
router.get('/:id', collegeController.getCollegeById);
router.put('/all', collegeController.updateCollege);
router.put('/:id', collegeController.updateCollege);
router.delete('/delete/:id', collegeController.deleteCollege);

module.exports = router;
