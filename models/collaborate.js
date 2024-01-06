const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Collaborate = sequelize.define('Collaborate', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyname: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'Collaborate',
});

const createCollaboration = async (collaborationData) => {
  try {
    const collaborate = await Collaborate.create(collaborationData);
    return collaborate;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  Collaborate,
  createCollaboration
};
