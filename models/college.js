// models/college.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const College = sequelize.define('College', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fees: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    eligibility: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selection: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    placements: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    averagePackage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    infrastructure: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'Colleges',
});

const createCollege = async (addData) => {
    try {
        const add = await College.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    College,
    createCollege
};
