const { createUser } = require('../models/user');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db'); // Import the sequelize instance here
const { VerificationRequest } = require('../models/verificationTag');
const { Blog } = require('../models/blog');
const { Op } = require('sequelize');

const SECRET_KEY = 'EDMERTION_SECRET'; // Replace this with a secure secret key

const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const generateUserId = (stateAcronym, age, sequenceNo, nameInitials) => {
    return `${stateAcronym}${age.toString().padStart(2, '0')}${sequenceNo.toString().padStart(4, '0')}${nameInitials}`;
};

const sendOtp = async (req, res) => {
    // Assuming OTP is generated here, replace with actual OTP generation logic
    const otp = '123456'; // Static OTP for demo purposes
    res.status(200).json({ message: 'OTP sent successfully' });
};

const verifyOtp = async (req, res) => {
    const { email, mobile, otp } = req.body;

    // Assuming OTP verification logic here, replace with actual verification logic
    const isOtpValid = otp === '123456'; // Static OTP for demo purposes

    if (isOtpValid) {
        // Save email and mobile to the database
        req.userData = { email, mobile };
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(401).json({ message: 'OTP verification failed' });
    }
};


const signup = async (req, res) => {
    const { email, mobile, firstName, lastName, dateOfBirth, country, state, city } = req.body;

    // Calculate age from date of birth (assuming it's provided during signup)
    const age = calculateAge(dateOfBirth).toString();

    // Assuming email and mobile verification are successful
    const isEmailVerified = true;
    const isMobileVerified = true;

    try {
        // Check if the user already exists with the provided email or mobile
        const existingUserByEmail = await User.findOne({ where: { email } });
        const existingUserByMobile = await User.findOne({ where: { mobile } });

        if (existingUserByEmail || existingUserByMobile) {
            return res.status(409).json({ message: 'User with the provided email or mobile already exists' });
        }

        // Generate a unique user ID
        const stateAcronym = state.substring(0, 2).toUpperCase();
        const sequenceNo = "1234"; // Replace this with the actual sequence number of the user (e.g., fetched from the database)
        const nameInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        const userId = generateUserId(stateAcronym, age, sequenceNo, nameInitials);

        // Save user data to the database
        const user = await createUser({
            userId,
            email,
            mobile,
            firstName,
            lastName,
            dateOfBirth,
            country,
            state,
            city,
            isEmailVerified,
            isMobileVerified,
            age,
        });

        res.status(201).json({ message: 'Signup successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

const verifyMobileOtp = async (mobile, otp) => {
    // Assuming OTP verification logic here, replace with actual verification logic

    const isOtpValid = otp === '123456'; // Static OTP for demo purposes

    return isOtpValid;
};

const verifyEmailOtp = async (email, otp) => {
    // Assuming OTP verification logic here, replace with actual verification logic
    const isOtpValid = otp === '123456'; // Static OTP for demo purposes

    return isOtpValid;
};

const findUserByMobile = async (mobile) => {
    try {
        // Assuming the User model has a method to find a user by mobile number
        const user = await User.findOne({ where: { mobile } });
        return user;
    } catch (error) {
        throw new Error('Error finding user by mobile');
    }
};

const loginWithMobileAndOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    try {
        const user = await findUserByMobile(mobile);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isOtpValid = await verifyMobileOtp(mobile, otp);
        if (!isOtpValid) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        //Handle your login logic here, e.g., issue an authentication token
        const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

const findUserByEmail = async (email) => {
    try {
        // Assuming the User model has a method to find a user by email
        const user = await User.findOne({ where: { email } });
        return user;
    } catch (error) {
        throw new Error('Error finding user by email');
    }
};

const loginWithEmailAndOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isOtpValid = await verifyEmailOtp(email, otp);
        if (!isOtpValid) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        //Handle your login logic here, e.g., issue an authentication token
        const token = jwt.sign({ userId: user.userId }, SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour

        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        res.status(500).json({ message: 'Error during login', error: error.message });
    }
};

const updateUserDetails = async (req, res) => {
    const { userId, firstName, lastName, dateOfBirth, country, state, city, profileImageUrl, about } = req.body;

    // Calculate age from date of birth (assuming it's provided during signup)
    const age = calculateAge(dateOfBirth).toString();

    try {
        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's details if provided
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (dateOfBirth) user.age = age;
        if (country) user.country = country;
        if (state) user.state = state;
        if (city) user.city = city;
        if (profileImageUrl) user.profileImageUrl = profileImageUrl;
        if (about) user.about = about;

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user details', error: error.message });
    }
};

const getUserDataByUserId = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is provided as a parameter

    try {
        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User data retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data', error: error.message });
    }
};

const getUserInfoPercentage = (user) => {
    const totalFields = 7; // Total number of user information fields (excluding userId)
    let filledFields = 0;

    if (user.firstName) filledFields++;
    if (user.lastName) filledFields++;
    if (user.age) filledFields++;
    if (user.country) filledFields++;
    if (user.state) filledFields++;
    if (user.city) filledFields++;
    if (user.profileImageUrl) filledFields++;

    const percentage = (filledFields / totalFields) * 100;
    return percentage.toFixed(2); // Convert to percentage and round to 2 decimal places
};

const getUserDataWithInfoPercentage = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is provided as a parameter

    try {
        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userInfoPercentage = getUserInfoPercentage(user);

        res.status(200).json({
            message: 'User data with information percentage retrieved successfully',
            userInfoPercentage: `${userInfoPercentage}%`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data with information percentage', error: error.message });
    }
};

const getUsersCountByCountry = async (req, res) => {
    try {
        const usersByCountry = await User.findAll({
            attributes: ['country', [sequelize.fn('COUNT', sequelize.col('country')), 'userCount']],
            group: ['country'],
        });

        res.status(200).json({ message: 'User count by country retrieved successfully', usersByCountry });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user count by country', error: error.message });
    }
};

const requestVerificationTag = async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the user has already submitted a verification request
        const existingRequest = await VerificationRequest.findOne({ where: { UserId: userId } });
        if (existingRequest) {
            return res.status(409).json({ message: 'Verification request already submitted' });
        }

        // Create a new verification request
        await VerificationRequest.create({
            UserId: userId,
        });

        res.status(201).json({ message: 'Verification request submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting verification request', error: error.message });
    }
};

const approveVerificationTag = async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await VerificationRequest.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Verification request not found' });
        }

        // Update the request status to approved
        request.status = 'approved';
        await request.save();

        res.status(200).json({ message: 'Verification request approved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error approving verification request', error: error.message });
    }
};

const rejectVerificationTag = async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await VerificationRequest.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Verification request not found' });
        }

        // Update the request status to rejected
        request.status = 'rejected';
        await request.save();

        res.status(200).json({ message: 'Verification request rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting verification request', error: error.message });
    }
};

const getUserTagsAndBlogs = async (req, res) => {
    const userId = req.body.userId; // Assuming you have user information in req.user after authentication

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userTags = user.usedTags ? user.usedTags.split(',') : [];

        // Convert userTags to array of strings for comparison
        const userTagsArray = userTags.map(tag => tag.trim());

        // Find blogs with tags that overlap with userTagsArray
        const blogs = await Blog.findAll({
            where: {
                tags: {
                    [Op.overlap]: userTagsArray,
                },
            },
        });

        res.status(200).json({ userTags, blogs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user tags and blogs', error: error.message });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    signup,
    loginWithMobileAndOtp,
    loginWithEmailAndOtp,
    updateUserDetails,
    getUserDataByUserId,
    getUserDataWithInfoPercentage,
    getUsersCountByCountry,
    requestVerificationTag,
    approveVerificationTag,
    rejectVerificationTag,
    getUserTagsAndBlogs
};
