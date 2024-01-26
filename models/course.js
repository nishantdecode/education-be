// models/course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    organization: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reviews: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    numberOfEnrollments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    instructor: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    level: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
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
