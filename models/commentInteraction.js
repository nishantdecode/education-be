const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { User } = require('./user');
const { Comment } = require('./comment');

const CommentInteraction = sequelize.define('CommentInteraction', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    interactionType: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
    },
    interactionTimestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

// Associations
CommentInteraction.belongsTo(Comment);
CommentInteraction.belongsTo(User, { foreignKey: 'UserId', targetKey: 'userId' });

module.exports = {
    CommentInteraction
};
