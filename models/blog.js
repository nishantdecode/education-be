const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { User } = require("./user");
const Blog = sequelize.define(
  "Blog",
  {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Use the ARRAY data type
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dislikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    clicks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Blogs",
  }
);

Blog.belongsTo(User, { foreignKey: "userId", targetKey: "userId" });

const createBlog = async (addData) => {
  try {
    const add = await Blog.create(addData);
    return add;
  } catch (error) {
    console.error("Validation error details:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  Blog,
  createBlog,
};
