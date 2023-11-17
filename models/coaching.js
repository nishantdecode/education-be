const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Coaching = sequelize.define('Coaching', {
    data: {
        type: DataTypes.JSONB, // Use JSONB data type for flexible JSON storage
        allowNull: false,
    },
}, {
    tableName: 'Coachings',
});

const createCoaching = async (addData) => {
    try {
        const coaching = await Coaching.create({ data: addData });
        return coaching;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Coaching,
    createCoaching
};
