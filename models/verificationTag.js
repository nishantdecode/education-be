const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");

const VerificationRequest = sequelize.define("VerificationRequest", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    allowNull: false,
    defaultValue: "pending",
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: "userId",
    },
  },
});

VerificationRequest.belongsTo(User, { foreignKey: "userId" });

module.exports = {
  VerificationRequest,
};
