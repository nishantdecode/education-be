const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Advertisement = sequelize.define('Advertisement', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    defaultValue: 'https://promova.com/content/advertising_terminology_0d63aea503.png',
  },
}, {
  tableName: 'Advertisements',
});

const createAdvertisement = async (addData) => {
  try {
    const add = await Advertisement.create(addData);
    return add;
  } catch (error) {
    console.error('Validation error details:', error);
    throw new Error(error.message);
  }
};

module.exports = {
  Advertisement,
  createAdvertisement
};
