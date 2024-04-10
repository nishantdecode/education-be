// models/serviceFAQAd.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceFAQ = sequelize.define('ServiceFAQ', {
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('course', 'college', 'scholarship', 'loan', 'coaching', 'all'), // Define the ENUM data type with possible values
        allowNull: true,
    }
}, {
    tableName: 'ServiceFAQs',
});

const createServiceFAQ = async (addData) => {
    try {
        addData.type = addData.type || 'all';
        const add = await ServiceFAQ.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    ServiceFAQ,
    createServiceFAQ
};
