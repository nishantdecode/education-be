const { sendMail } = require('../helper/EmailViaBrevo.helper');
const sendEmail = require('../middlewares/sendMail');
const { Newsletter } = require('../models/newsletter');
const { submitForm } = require('../models/newsletter');

const apply = async (req, res) => {
    const { email } = req.body;

    try {
        const submission = await submitForm({
            email
        });
        
        sendMail(email,"Subscribed", "Dear User, You have successfully subscribed for Edmertion newsletter. You will get regular updates in your inbox.")
        // const response = sendEmail(email, "Subscribed", "Dear User, You have successfully subscribed for Edmertion newsletter. You will get regular updates in your inbox.");

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
