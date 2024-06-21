const { createUser } = require('../models/user');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db'); // Import the sequelize instance here
const { VerificationRequest } = require('../models/verificationTag');
const { Blog } = require('../models/blog');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // Import the UUID function
const { sendMail } = require('../middlewares/mailSender.helper');
const { createOTP, OTP } = require('../models/otp');

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
    try {
      const { email, mobile } = req.body;
      console.log(email, mobile);
  
      // Check if the email exists in the database
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        console.log('Email not found');
        return res.status(404).json({ message: 'Email not found', emailExists: false });
      }
  
      console.log("DBUSER", user.email);
  
      // Hardcoded OTP for testing
      const otp = '123456';
  
      // Save OTP to the database
      await createOTP({ value: otp, email, mobile });
  
      // Send OTP via email
      await sendMail(email, "OTP Verification", `Your OTP for verification is: ${otp}`);
  
      return res.status(200).json({ message: 'OTP sent successfully', emailExists: true });
    } catch (error) {
      console.error(`Error in sendOtp for email ${req.body.email}:`, error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const sendOtptest = async (req, res) => {
    try {
      const { email, mobile } = req.body;
      console.log(email, mobile);
  
      // Check if the email and mobile exist in the database
      const existingUser = await User.findOne({ where: { email, mobile } });
  
      if (existingUser) {
        console.log('User with email and mobile already exists');
        return res.status(400).json({ message: 'User with email and mobile already exists', emailExists: true });
      }
  
      // Hardcoded OTP for testing
      const otp = '123456';
  
      // Save OTP to the database
      await createOTP({ value: otp, email, mobile });
  
      // Send OTP via email
      await sendMail(email, "OTP Verification", `Your OTP for verification is: ${otp}`);
  
      return res.status(200).json({ message: 'OTP sent successfully', emailExists: false });
    } catch (error) {
      console.error(`Error in sendOtp for email ${req.body.email}:`, error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  
  

const verifyOtp = async (req, res) => {
    const { email, mobile, otp } = req.body;

    console.log(email, otp)
    let otpFound;
    if(email) {
        otpFound = await OTP.findAll({ where: { email } });
    } else {
        otpFound = await OTP.findAll({ where: { mobile } });
    }

    console.log(otpFound)
    // Assuming OTP verification logic here, replace with actual verification logic
    let isOtpValid = false;

    if (otpFound.length > 0) {
        // Check if any OTP matches the provided OTP
        isOtpValid = otpFound.some(entry => entry.value === otp); // Static OTP for demo purposes
    }

    console.log(isOtpValid)
    if (isOtpValid) {
        // Save email and mobile to the database
        req.userData = { email, mobile };
        // Assuming you want to delete all found OTPs
        await OTP.destroy({ where: { id: otpFound.map(entry => entry.id) } });
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(401).json({ message: 'OTP verification failed' });
    }
};

const signup = async (req, res) => {
    const { role, email, mobile, firstName, lastName, dateOfBirth, country, state, city } = req.body;

    // Calculate age from date of birth (assuming it's provided during signup)
    const age = calculateAge(dateOfBirth).toString();

    // Assuming email andc mobile verification are successful
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
        const uuid = uuidv4().replace(/-/g, ""); // Remove hyphens from UUID
        const sequenceNo = uuid.substring(0, 4); // Extract the first 4 digits
        const nameInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        const userId = generateUserId(stateAcronym, age, sequenceNo, nameInitials);

        // Save user data to the database
        const user = await createUser({
            role,
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
    let otpFound = await OTP.findAll({ where: { mobile } });

    let isOtpValid = false;

    if (otpFound.length > 0) {
        isOtpValid = otpFound.some(entry => entry.value === otp);
    }

    if (isOtpValid) {
        await OTP.destroy({ where: { id: otpFound.map(entry => entry.id) } });
    }
    return isOtpValid;
};

const verifyEmailOtp = async (email, otp) => {
    let otpFound = await OTP.findAll({ where: { email } });

    let isOtpValid = false;

    if (otpFound.length > 0) {
        isOtpValid = otpFound.some(entry => entry.value === otp);
    }

    if (isOtpValid) {
        await OTP.destroy({ where: { id: otpFound.map(entry => entry.id) } });
    }
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
        console.log(error)
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
    const { userId, firstName, lastName, dateOfBirth, country, state, city, profileImageUrl, about, gender, interests, skills, school, qualification, college, profession, personality, traits } = req.body;

    // Calculate age from date of birth (assuming it's provided during signup)
    const age = calculateAge(dateOfBirth).toString();

    try {
        // Convert interests from a comma-separated string to an array of tags
        const interestArray = interests ? interests.split(',').map(interest => interest.trim()) : []

        // Convert skills from a comma-separated string to an array of tags
        const skillArray = skills ? skills?.split(',').map(skill => skill.trim()) : []
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
        if (gender) user.gender = gender;
        if (interests) user.interests = interestArray;
        if (skills) user.skills = skillArray;
        if (school) user.school = school;
        if (qualification) user.qualification = qualification;
        if (college) user.college = college;
        if (profession) user.profession = profession;
        if (personality) user.personality = personality;
        if (traits) user.traits = traits;

        // Save the updated user details
        await user.save();

        res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user details', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ message: 'All users retrieved successfully', users });
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

//user with blogs data if no blogs when return empty array []
const getUserDataByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let blogs;
        if (user) {
            blogs = await Blog.findAll({ where: { userId } });
        }

        res.status(200).json({ message: 'User data retrieved successfully', user, blogs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user data', error: error.message });
    }
};


const getUserInfoPercentage = (user) => {
    const totalFields = 8; // Total number of user information fields (excluding userId)
    let filledFields = 0;

    if (user.firstName) filledFields++;
    if (user.lastName) filledFields++;
    if (user.age) filledFields++;
    if (user.country) filledFields++;
    if (user.state) filledFields++;
    if (user.city) filledFields++;
    if (user.profileImageUrl) filledFields++;
    if (user.about) filledFields++;

    const percentage = (filledFields / totalFields) * 100;
    return percentage.toFixed(2); // Convert to percentage and round to 2 decimal places
};

const getUserDataWithInfoPercentage = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is provided as a parameter

    console.log(userId)
    try {
        const user = await User.findOne({ where: { userId } });
console.log(user)
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
    sendOtptest,
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
    getUserTagsAndBlogs,
    getAllUsers
};
