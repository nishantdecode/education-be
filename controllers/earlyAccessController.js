const { EarlyAccess } = require('../models/earlyaccess');
const { submitForm } = require('../models/earlyaccess');

const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    console.log(dob);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const submit = async (req, res) => {
    const { name, dateOfBirth, email, mobile, city, state, country, education, college, field, stream, preferField, preferLevel, preferLocation, expectation } = req.body;

    // Calculate age from date of birth (assuming it's provided during signup)
    const age = calculateAge(dateOfBirth).toString();

    try {
        const submission = await submitForm({
            name, dateOfBirth, age, email, mobile, city, state, country, education, college, field, stream, preferField, preferLevel, preferLocation, expectation
        });
        res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting form', error: error.message });
    }
};

const getAllSubmissions = async (req, res) => {
    try {
        const submissions = await EarlyAccess.findAll();
        res.status(200).json({ message: 'All submissions retrieved successfully', submissions });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submissions', error: error.message });
    }
};

module.exports = {
    submit,
    getAllSubmissions,
};
