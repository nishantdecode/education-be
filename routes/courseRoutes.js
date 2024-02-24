// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { singleFileUploadMiddleware } = require('../middlewares/file-upload.middlewares');

router.post('/', courseController.create);
router.post('/import', courseController.importCourseData);
router.post('/all', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
