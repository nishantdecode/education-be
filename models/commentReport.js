const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Comment } = require("./comment");

const CommentReport = sequelize.define("CommentReport", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

CommentReport.belongsTo(Comment, {
  foreignKey: "commentId",
  targetKey: "id",
});
Comment.hasMany(CommentReport, {
  foreignKey: "commentId",
  targetKey: "id",
});

module.exports = {
  CommentReport,
};
