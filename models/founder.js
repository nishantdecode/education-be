const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Founder = sequelize.define('Founder', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'Founders', // Explicitly set the table name to 'founders'
});

const create = async (founderData) => {
    try {
        const founder = await Founder.create(founderData);
        return founder;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Founder, // Export the Founder model itself
    create
};
