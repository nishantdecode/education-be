// userRoutes.js
const express = require('express');
const router = express.Router();
const {
    sendOtp,
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

// Send OTP route
router.post('/sendotp', sendOtp);

// Verify OTP route
router.post('/verifyotp', verifyOtp);

// Signup route
router.post('/signup', signup);

// Login with mobile & OTP route
router.post('/login/mobile', loginWithMobileAndOtp);

// Login with email & OTP route
router.post('/login/email', loginWithEmailAndOtp);

router.put('/update-user', updateUserDetails); // Requires authentication

router.get('/user/:userId', getUserDataByUserId); // Retrieve user data by userID
router.get('/', getAllUsers);
router.get('/user/:userId/info', getUserDataWithInfoPercentage);

router.get('/count', getUsersCountByCountry); // Retrieve user count

router.post('/request-verification/:userId', requestVerificationTag);
router.put('/approve-verification/:requestId', approveVerificationTag);
router.put('/reject-verification/:requestId', rejectVerificationTag);

router.get('/tags-and-blogs', getUserTagsAndBlogs);

module.exports = router;
