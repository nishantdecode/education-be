// models/course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING(2048),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numberOfEnrollments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    mode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organisation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    instructor: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'Courses',
});

const createCourse = async (addData) => {
    try {
        const add = await Course.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Course,
    createCourse
};
