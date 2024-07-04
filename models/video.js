const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Video = sequelize.define(
  "Video",
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Videos",
  }
);

const createVideo = async (videoData) => {
  try {
    const video = await Video.create(videoData);
    return video;
  } catch (error) {
    console.error("Validation error details:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  Video, // Export the Video model itself
  createVideo,
};
