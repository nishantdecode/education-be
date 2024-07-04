// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userroutes');
const collaborateRoutes = require('./collaborateroutes');
const videoRoutes = require('./videoroutes');
const advertisementRoutes = require('./advertisementRoute');
const founderRoutes = require('./founderRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const offerRoutes = require('./offerRoute');
const newsRoutes = require('./newsRoute');
const partnerRoutes = require('./partnerRoute');
const blogRoutes = require('./blogRoutes');
const newsletterRoutes = require('./newsletterroutes');
const socialRoutes = require('./socialRoute');
const commentRoutes = require('./commentRoutes');
const courseRoutes = require('./courseRoutes');
const featureAdRoutes = require('./featureAdRoutes');
const collegeRoutes = require('./collegeRoutes');
const serviceFAQRoutes = require('./serviceFAQRoutes');
const scholarshipRoutes = require('./scholarshipRoutes');
const loanRoutes = require('./loanRoutes');
const coachingRoutes = require('./coachingRoutes');
const conversationRoutes = require('./conversationRoutes');
const slotRoutes = require('./slotRoutes');
const orderRoutes = require('./orderRoutes');
const zoomRoutes = require('./zoomRoutes');
const { FileUploadRouter } = require('./fileuploadRoutes');
// Add other route files here if needed

// Mount routes
router.use('/users', userRoutes);
router.use('/collaborate', collaborateRoutes);
router.use('/videos', videoRoutes);
router.use('/advertisements', advertisementRoutes);
router.use('/founder', founderRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/offers', offerRoutes);
router.use('/news', newsRoutes);
router.use('/file/upload', FileUploadRouter);
router.use('/partner', partnerRoutes);
router.use('/blogs', blogRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/social', socialRoutes);
router.use('/comment', commentRoutes);
router.use('/course', courseRoutes);
router.use('/featureAd', featureAdRoutes);
router.use('/college', collegeRoutes);
router.use('/servicefaq', serviceFAQRoutes);
router.use('/scholarship', scholarshipRoutes);
router.use('/loan', loanRoutes);
router.use('/coaching', coachingRoutes);
router.use('/conversation', conversationRoutes);
router.use('/slot', slotRoutes);
router.use('/order', orderRoutes);
router.use('/zoom', zoomRoutes);

module.exports = router;
