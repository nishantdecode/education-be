const express = require('express');
const { otpController, sociallinkedin, socialgoogle } = require('../controllers/index.js');

const router = express.Router();

router.post('/sendMobileOtp', otpController.sendMobileOtp);
router.post('/verifyMobileOtp', otpController.verifyMobileOtp);
router.post('/sendEmailOtp', otpController.sendEmailOtp);
router.post('/verifyEmailOtp', otpController.verifyEmailOtp);
router.use('/social/linkedin', sociallinkedin);
router.use('/social/google', socialgoogle);
module.exports = router;
