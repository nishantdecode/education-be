// userRoutes.js
const express = require('express');
const router = express.Router();
const {
    sendOtp,
    sendOtptest,
    verifyOtp,
    signup,
    loginWithMobileAndOtp,
    loginWithEmailAndOtp,
    updateUserDetails,
    getUserDataByUserId,
    getUserDataWithInfoPercentage,
    getUsersCountByCountry,
    approveVerificationTag,
    rejectVerificationTag,
    requestVerificationTag,
    getUserTagsAndBlogs,
    getAllUsers
} = require('../controllers/userController');

router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);
router.post('/login/mobile', loginWithMobileAndOtp);
router.post('/login/email', loginWithEmailAndOtp);

router.post('/signup', signup);

router.put('/update-user', updateUserDetails);
router.get('/user/:userId', getUserDataByUserId);
router.get('/', getAllUsers);
router.get('/user/:userId/info', getUserDataWithInfoPercentage);
router.get('/count', getUsersCountByCountry);

router.post('/request-verification/:userId', requestVerificationTag);
router.put('/approve-verification/:requestId', approveVerificationTag);
router.put('/reject-verification/:requestId', rejectVerificationTag);
router.get('/tags-and-blogs', getUserTagsAndBlogs);

module.exports = router;
