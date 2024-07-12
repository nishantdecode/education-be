const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Slot = sequelize.define(
  "Slot",
  {
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    slotDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookingUserId: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM("Booked", "Available"),
      defaultValue: "Available",
      allowNull: false,
    },
  },
  {
    tableName: "Slot",
  }
);

module.exports = {
  Slot,
};