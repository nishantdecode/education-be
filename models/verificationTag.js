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
  UserId: {
    type: DataTypes.STRING, // Adjust based on your User model's primary key type
    allowNull: false,
    references: {
      model: User,
      key: "id", // Assuming 'id' is the primary key of the User model
    },
  },
});

// Associations
VerificationRequest.belongsTo(User, { foreignKey: "UserId" });

module.exports = {
  VerificationRequest,
};
