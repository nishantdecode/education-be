// models/order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Meeting } = require("./meeting");
const { Slot } = require("./slot");
const { User } = require("./user");

const Order = sequelize.define(
  "Order",
  {
    topic: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meetingId: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    razorpay_order_id: {
      type: DataTypes.STRING,
    },
    razorpay_payment_id: {
      type: DataTypes.STRING,
    },
    razorpay_signature: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("Successful", "Failed", "Pending"),
      defaultValue: "Pending",
      allowNull: false,
    },
  },
  {
    tableName: "Order",
  }
);

// Associations
Order.belongsTo(Meeting, { foreignKey: "meetingId", targetKey: "id" });
Order.belongsTo(Slot, { foreignKey: "slotId", targetKey: "id" });
Order.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });

module.exports = {
  Order,
};