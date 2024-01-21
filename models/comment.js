const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const { Blog } = require('./blog');
const { User } = require('./user');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    dislikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    BlogId: { // Add the foreign key column
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
}, {
    tableName: 'Comments',
});

// Associations
Comment.belongsTo(Blog); // Establish the association with the Blog model
Comment.belongsTo(User, { foreignKey: 'userId' , targetKey: 'userId'});

const createComment = async (addData) => {
    try {
        const add = await Comment.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Comment,
    createComment
};
