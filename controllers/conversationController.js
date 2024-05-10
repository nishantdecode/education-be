// controllers/collegeController.js
const { Conversation, createConversation } = require("../models/conversation");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    console.log(req.body)
    const conversation = await createConversation(req.body);
    res.status(201).json({ message: "Conversation created successfully", conversation });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Conversation", error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const { userId, conversationId } = req.body;
    console.log(userId, conversationId)
    const filters = {
      where: {
        [Op.and]:[]
      },
    }
    if(userId){
      filters.where.userId ={
        [Op.iLike]: userId 
      }
    }
    if(conversationId){
        filters.where.conversationId ={
          [Op.iLike]: conversationId 
        }
    }
    const conversation = await Conversation.findAll({
      ...filters,
    });
 
    console.log(conversation)
    res.status(200).json({
      message: "Conversation retrieved successfully",
      conversation,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving conversation", error: error.message });
  }
};

module.exports = {
  create,
  getConversations
};
