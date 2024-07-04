const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const News = sequelize.define('News', {
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
  article: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sources: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'Newss',
});

const createNews = async (addData) => {
  try {
    const add = await News.create(addData);
    return add;
  } catch (error) {
    console.error('Validation error details:', error);
    throw new Error(error.message);
  }
};

module.exports = {
  News,
  createNews
};
