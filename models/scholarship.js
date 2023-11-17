const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Scholarship = sequelize.define('Scholarship', {
    data: {
        type: DataTypes.JSONB, // Use JSONB data type for flexible JSON storage
        allowNull: false,
    },
}, {
    tableName: 'Scholarships',
});

const createScholarship = async (addData) => {
    try {
        const scholarship = await Scholarship.create({ data: addData });
        return scholarship;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Scholarship,
    createScholarship
};
