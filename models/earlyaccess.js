const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EarlyAccess = sequelize.define('EarlyAccess', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    education: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    college: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    field: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stream: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    preferField: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preferLevel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    preferLocation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expectation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'EarlyAccess', // Explicitly set the table name to 'EarlyAccess'
});

// Define the submitForm function and export it
const submitForm = async (formData) => {
    try {
        const form = await EarlyAccess.create(formData);
        return form;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    EarlyAccess, // Export the Form model itself
    submitForm, // Export the submitForm function
};
