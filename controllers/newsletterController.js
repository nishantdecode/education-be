const { Newsletter } = require('../models/newsletter');
const { submitForm } = require('../models/newsletter');

const apply = async (req, res) => {
    const { email } = req.body;

    try {
        const submission = await submitForm({
            email 
        });
        res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting form', error: error.message });
    }
};

const applications = async (req, res) => {
    try {
        const submissions = await Newsletter.findAll();
        res.status(200).json({ message: 'All submissions retrieved successfully', submissions });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving submissions', error: error.message });
    }
};

module.exports = {
    apply,
    applications,
};
