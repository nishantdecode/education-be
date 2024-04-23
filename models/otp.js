// models/course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OTP = sequelize.define('OTP', {
    value: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    mobile: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'OTP',
});

const createOTP = async (addData) => {
    try {
        const add = await OTP.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    OTP,
    createOTP
};
