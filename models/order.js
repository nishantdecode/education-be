// models/serviceFAQAd.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
      type: DataTypes.STRING,
      allowNull: false,
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

module.exports = {
  Order,
};
