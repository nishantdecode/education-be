const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Testimonial = sequelize.define('Testimonial', {
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
    age: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    question1Rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    question2Rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    question3Rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    tableName: 'Testimonials',
});

const createTestimonial = async (addData) => {
    try {
        const add = await Testimonial.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Testimonial,
    createTestimonial
};
