const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Newsletter = sequelize.define('Newsletter', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'Newsletter', // Explicitly set the table name to 'Newsletter'
});

// Define the submitForm function and export it
const submitForm = async (formData) => {
    try {
        const form = await Newsletter.create(formData);
        return form;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    Newsletter,
    submitForm,
};
