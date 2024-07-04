const { News } = require("../models/news");
const { createNews } = require("../models/news");

const createAdd = async (req, res) => {
  try {
    const news = await createNews(req.body);

    res.status(201).json({ message: "News created successfully", news });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating coaching", error: error.message });
  }
};

const getAllNewss = async (req, res) => {
  try {
    const newss = await News.findAll();
    res
      .status(200)
      .json({ message: "All newss retrieved successfully", newss });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving newss", error: error.message });
  }
};

const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News retrieved successfully", news });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving news", error: error.message });
  }
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, link, type } = req.body;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    news.title = title;
    news.description = description;
    news.imageUrl = imageUrl;
    news.link = link;
    news.type = type;

    await news.save();

    res.status(200).json({ message: "News updated successfully", news });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating news", error: error.message });
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    await news.destroy();

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting news", error: error.message });
  }
};

module.exports = {
  createAdd,
  getAllNewss,
  getNewsById,
  updateNews,
  deleteNews,
};
