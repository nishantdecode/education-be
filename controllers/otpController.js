const twilio = require('twilio');
const { User } = require('../models/index');
require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

let otpMap = new Map();

exports.sendMobileOtp = (req, res) => {
    const { phoneNumber } = req.body;
    const mobileotp = Math.floor(100000 + Math.random() * 900000);

    client.messages
        .create({
            body: `Your verification code is ${mobileotp}`,
            from: process.env.TWILIO_NUMBER,
            to: phoneNumber,
        })
        .then(() => {
            otpMap.set(phoneNumber, mobileotp);
            res.json({
                message: 'OTP sent successfully',
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message,
            });
        });
};

exports.verifyMobileOtp = async (req, res) => {
    const { phoneNumber, mobileotp } = req.body;

    // Verify the OTP here
    if (otpMap.has(phoneNumber) && otpMap.get(phoneNumber) == mobileotp) {
        otpMap.delete(phoneNumber);
        try {
            let user = await User.findOne({ phoneNumber });
            if (!user) {
                user = new User({ phoneNumber });
            } else if (user.verified) {
                return res.json({
                    message: 'Phone number already verified',
                    user,
                });
            }
            user.verified = true;
            await user.save();
            res.json({
                message: 'Phone Verification Successfull',
            });
        } catch (err) {
            res.status(500).json({
                error: err.message,
            });
        }
    } else {
        res.status(401).json({
            error: 'Invalid OTP',
        });
    }
};

exports.sendEmailOtp = (req, res) => {
    const { email } = req.body;
    client.verify.v2.services(process.env.SID)
        .verifications
        .create({ to: email, channel: 'email' })
        .then((verification) => {
            res.json({
                message: "OTP sent successfully to entered email address"
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message,
            });
        });
};

exports.verifyEmailOtp = async (req, res) => {
    const { email, emailotp } = req.body;
    client.verify.v2.services(process.env.SID)
        .verificationChecks
        .create({ to: email, code: emailotp })
        .then(async (verification_check) => {
            if (verification_check.status === "approved") {
                try {
                    let user = await User.findOne({ email });
                    if (!user) {
                        user = new User({ email });
                    } else {
                        return res.json({
                            message: 'Email already verified',
                            user,
                        });
                    }
                    await user.save();
                    res.json({
                        message: 'Email Verification Successfull',
                    });
                } catch (err) {
                    res.status(500).json({
                        error: err.message,
                    });
                }
            } else {
                res.status(401).json({
                    error: 'Invalid OTP',
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                error: err.message,
            });
        });
};
