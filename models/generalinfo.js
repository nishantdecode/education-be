const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Generalinfo = sequelize.define('Generalinfo', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    tnclink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pplink: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'Generalinfos',
});

const createGeneralinfo = async (addData) => {
    try {
        const add = await Generalinfo.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Generalinfo,
    createGeneralinfo
};
