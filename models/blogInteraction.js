const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const { Blog } = require("./blog");

const BlogInteraction = sequelize.define("BlogInteraction", {
  interactionType: {
    type: DataTypes.ENUM("like", "dislike"),
    allowNull: false,
  },
  interactionTimestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Associations
BlogInteraction.belongsTo(Blog, { foreignKey: "BlogId" });
BlogInteraction.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });

module.exports = {
  BlogInteraction,
};
