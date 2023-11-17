const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');

router.post('/testimonials', testimonialController.createAdd);
router.get('/testimonials', testimonialController.getAllTestimonials);
router.get('/testimonials/:id', testimonialController.getTestimonialById);
router.put('/testimonials/:id', testimonialController.updateTestimonial);
router.delete('/testimonials/:id', testimonialController.deleteTestimonial);

module.exports = router;
