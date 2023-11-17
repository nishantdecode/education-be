const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CommentReport = sequelize.define('CommentReport', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    }
});

module.exports = {
    CommentReport
};
