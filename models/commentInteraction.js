const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Comment } = require("./comment");

const CommentInteraction = sequelize.define("CommentInteraction", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  interactionType: {
    type: DataTypes.ENUM("like", "dislike"),
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  commentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Associations
CommentInteraction.belongsTo(Comment, {
  foreignKey: "commentId",
  targetKey: "id",
});
Comment.hasMany(CommentInteraction, {
  foreignKey: "commentId",
  targetKey: "id",
});
CommentInteraction.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
});

module.exports = {
  CommentInteraction,
};
