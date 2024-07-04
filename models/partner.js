const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Partner = sequelize.define(
  "Partner",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sources: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Partners",
  }
);

const createPartner = async (addData) => {
  try {
    const add = await Partner.create(addData);
    return add;
  } catch (error) {
    console.error("Validation error details:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  Partner,
  createPartner,
};
