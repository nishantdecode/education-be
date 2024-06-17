// models/college.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const College = sequelize.define(
  "College",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_data: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
      defaultValue: [],
    },
    fees: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    eligibility: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    selection: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    placements: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    averagePackage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialization:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    admission:{
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
      defaultValue: [],
    },
    infrastructure: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    features_rating:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    },
    other_facilities:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    tableName: "Colleges",
  }
);

const createCollege = async (addData) => {
  try {
    const add = await College.create(addData);
    return add;
  } catch (error) {
    console.error("Validation error details:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  College,
  createCollege,
};
