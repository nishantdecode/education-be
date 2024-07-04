const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const {User} = require("./user")

const Meeting = sequelize.define(
  "Meeting",
  {
    topic: {
      type: DataTypes.STRING,
    },
    slotId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.DATE,
    },
    endTime: {
      type: DataTypes.DATE,
    },
    attendeeLink: {
      type: DataTypes.STRING(1024),
    },
    hostLink: {
      type: DataTypes.STRING(1024),
    },
    status: {
      type: DataTypes.ENUM("Join", "Joined", "Expired"),
      defaultValue: "Join",
    },
  },
  {
    tableName: "Meeting",
  }
);

Meeting.belongsTo(User, { foreignKey: 'userId', targetKey: 'userId' });

module.exports = {
  Meeting,
};
