const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Comment } = require('./comment');

const CommentReport = sequelize.define('CommentReport', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    UserId:{
        type: DataTypes.STRING,
        // allowNull: false
    }
});

CommentReport.belongsTo(Comment);
Comment.hasMany(CommentReport); 

module.exports = {
    CommentReport
};
