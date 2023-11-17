const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Offer = sequelize.define('Offer', {
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
    allowNull: true,
  },
}, {
  tableName: 'Offers',
});

const createOffer = async (addData) => {
  try {
    const add = await Offer.create(addData);
    return add;
  } catch (error) {
    console.error('Validation error details:', error);
    throw new Error(error.message);
  }
};

module.exports = {
  Offer,
  createOffer
};
