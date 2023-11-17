// models/featureAdAd.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FeatureAd = sequelize.define('FeatureAd', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('course', 'college', 'scholarship', 'loan', 'coaching', 'all'), // Define the ENUM data type with possible values
        allowNull: false,
    }
}, {
    tableName: 'FeatureAds',
});

const createFeatureAd = async (addData) => {
    try {
        const add = await FeatureAd.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    FeatureAd,
    createFeatureAd
};
