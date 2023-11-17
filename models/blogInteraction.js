const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { User } = require('./user');
const { Blog } = require('./blog');

const BlogInteraction = sequelize.define('BlogInteraction', {
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
BlogInteraction.belongsTo(Blog);

BlogInteraction.belongsTo(User, { foreignKey: 'UserId', targetKey: 'userId' });

module.exports = {
    BlogInteraction
};
