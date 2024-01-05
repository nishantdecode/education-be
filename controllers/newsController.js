const cloudinary = require('cloudinary').v2;
const { News } = require('../models/news');
const { createNews } = require('../models/news');

const createAdd = async (req, res) => {
    const { title, description, link, type } = req.body;
    console.log("Uploaded Image File:", req.files.image);

    if (!req.files || !req.files.image) {
        return res.status(400).json({ message: 'No image file provided' });
    }

    const imageFile = req.files.image;
    console.log("Image File Path:", imageFile.tempFilePath);

    if (!imageFile.tempFilePath) {
        return res.status(400).json({ message: 'Image file path is missing' });
    }

    try {
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath, { folder: "edmertion" });

        const news = await createNews({ title, description, imageUrl: result.url, link, type });

        res.status(201).json({ message: 'News created successfully', news });
    } catch (error) {
        console.error('Error in createNews:', error);  // Log the complete error
        res.status(500).json({
            message: 'Error creating News',
            error: error.message,  // Send detailed error message
            stack: error.stack     // Optionally include the stack trace
        });
    }
};

const getAllNewss = async (req, res) => {
    try {
        const newss = await News.findAll();
        res.status(200).json({ message: 'All newss retrieved successfully', newss });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving newss', error: error.message });
    }
};

const getNewsById = async (req, res) => {
    const { id } = req.params;

    try {
        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(200).json({ message: 'News retrieved successfully', news });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving news', error: error.message });
    }
};

const updateNews = async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl, link, type } = req.body;

    try {
        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        news.title = title;
        news.description = description;
        news.imageUrl = imageUrl;
        news.link = link;
        news.type = type;

        await news.save();

        res.status(200).json({ message: 'News updated successfully', news });
    } catch (error) {
        res.status(500).json({ message: 'Error updating news', error: error.message });
    }
};

const deleteNews = async (req, res) => {
    const { id } = req.params;

    try {
        const news = await News.findByPk(id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        await news.destroy();

        res.status(200).json({ message: 'News deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting news', error: error.message });
    }
};

module.exports = {
    createAdd,
    getAllNewss,
    getNewsById,
    updateNews,
    deleteNews,
};
