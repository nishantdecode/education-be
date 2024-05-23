// models/course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Conversation = sequelize.define('Conversation', {
    name: {
        type: DataTypes.STRING,
    },
    conversationId: {
        type: DataTypes.STRING,
    },
    userId: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'Conversation',
});

const createConversation = async (addData) => {
    try {
        const add = await Conversation.create(addData);
        return add;
    } catch (error) {
        console.error('Validation error details:', error);
        throw new Error(error.message);
    }
};

module.exports = {
    Conversation,
    createConversation
};
