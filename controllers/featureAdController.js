// controllers/featureAdController.js
const { FeatureAd, createFeatureAd } = require('../models/featureAd');

const create = async (req, res) => {
    try {
        const featureAd = await createFeatureAd(req.body);
        res.status(201).json({ message: 'FeatureAd created successfully', featureAd });
    } catch (error) {
        res.status(500).json({ message: 'Error creating featureAd', error: error.message });
    }
};

const getAllFeatureAds = async (req, res) => {
    try {
        const featureAds = await FeatureAd.findAll();
        res.status(200).json({ message: 'All featureAds retrieved successfully', featureAds });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving featureAds', error: error.message });
    }
};

const getAllFeatureAdsByType = async (req, res) => {
    const { type } = req.params;

    try {
        const featureAds = await FeatureAd.findAll({
            where: { type },
        });
        res.status(200).json({ message: `All ${type} feature ads retrieved successfully`, featureAds });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feature ads', error: error.message });
    }
};

const getFeatureAdById = async (req, res) => {
    const { id } = req.params;

    try {
        const featureAd = await FeatureAd.findByPk(id);
        if (!featureAd) {
            return res.status(404).json({ message: 'FeatureAd not found' });
        }
        res.status(200).json({ message: 'FeatureAd retrieved successfully', featureAd });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving featureAd', error: error.message });
    }
};

const updateFeatureAd = async (req, res) => {
    const { id } = req.params;

    try {
        const featureAd = await FeatureAd.findByPk(id);
        if (!featureAd) {
            return res.status(404).json({ message: 'FeatureAd not found' });
        }

        await featureAd.update(req.body);

        res.status(200).json({ message: 'FeatureAd updated successfully', featureAd });
    } catch (error) {
        res.status(500).json({ message: 'Error updating featureAd', error: error.message });
    }
};

const deleteFeatureAd = async (req, res) => {
    const { id } = req.params;

    try {
        const featureAd = await FeatureAd.findByPk(id);
        if (!featureAd) {
            return res.status(404).json({ message: 'FeatureAd not found' });
        }

        await featureAd.destroy();

        res.status(200).json({ message: 'FeatureAd deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting featureAd', error: error.message });
    }
};

module.exports = {
    create,
    getAllFeatureAds,
    getFeatureAdById,
    updateFeatureAd,
    deleteFeatureAd,
    getAllFeatureAdsByType
};
