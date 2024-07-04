const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Social = sequelize.define(
  "Social",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    platform: {
      type: DataTypes.STRING,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Socials",
  }
);

const createSocial = async (addData) => {
  try {
    const add = await Social.create(addData);
    return add;
  } catch (error) {
    console.error("Validation error details:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  Social,
  createSocial,
};
