// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userroutes');
const collaborateRoutes = require('./collaborateroutes');
const earlyAccessRoutes = require('./earlyaccessroutes');
const videoRoutes = require('./videoroutes');
const advertisementRoutes = require('./advertisementRoute');
const founderRoutes = require('./founderRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const offerRoutes = require('./offerRoute');
const newsRoutes = require('./newsRoute');
const partnerRoutes = require('./partnerRoute');
const blogRoutes = require('./blogRoutes');
const newsletterRoutes = require('./newsletterroutes');
const generalinfoRoutes = require('./generalinforoutes');
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
const { FileUploadRouter } = require('./fileuploadRoutes');
// Add other route files here if needed

// Mount routes
router.use('/users', userRoutes);
router.use('/collaborate', collaborateRoutes);
router.use('/earlyaccess', earlyAccessRoutes);
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
router.use('/generalinfo', generalinfoRoutes);
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

module.exports = router;
