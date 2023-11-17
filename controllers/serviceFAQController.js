// controllers/serviceFAQController.js
const { ServiceFAQ, createServiceFAQ } = require('../models/serviceFAQ');

const create = async (req, res) => {
    try {
        const serviceFAQ = await createServiceFAQ(req.body);
        res.status(201).json({ message: 'ServiceFAQ created successfully', serviceFAQ });
    } catch (error) {
        res.status(500).json({ message: 'Error creating serviceFAQ', error: error.message });
    }
};

const getAllServiceFAQs = async (req, res) => {
    try {
        const serviceFAQs = await ServiceFAQ.findAll();
        res.status(200).json({ message: 'All serviceFAQs retrieved successfully', serviceFAQs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving serviceFAQs', error: error.message });
    }
};

const getAllServiceFAQsByType = async (req, res) => {
    const { type } = req.params;

    try {
        const serviceFAQs = await ServiceFAQ.findAll({
            where: { type },
        });
        res.status(200).json({ message: `All ${type} feature ads retrieved successfully`, serviceFAQs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feature ads', error: error.message });
    }
};

const getServiceFAQById = async (req, res) => {
    const { id } = req.params;

    try {
        const serviceFAQ = await ServiceFAQ.findByPk(id);
        if (!serviceFAQ) {
            return res.status(404).json({ message: 'ServiceFAQ not found' });
        }
        res.status(200).json({ message: 'ServiceFAQ retrieved successfully', serviceFAQ });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving serviceFAQ', error: error.message });
    }
};

const updateServiceFAQ = async (req, res) => {
    const { id } = req.params;

    try {
        const serviceFAQ = await ServiceFAQ.findByPk(id);
        if (!serviceFAQ) {
            return res.status(404).json({ message: 'ServiceFAQ not found' });
        }

        await serviceFAQ.update(req.body);

        res.status(200).json({ message: 'ServiceFAQ updated successfully', serviceFAQ });
    } catch (error) {
        res.status(500).json({ message: 'Error updating serviceFAQ', error: error.message });
    }
};

const deleteServiceFAQ = async (req, res) => {
    const { id } = req.params;

    try {
        const serviceFAQ = await ServiceFAQ.findByPk(id);
        if (!serviceFAQ) {
            return res.status(404).json({ message: 'ServiceFAQ not found' });
        }

        await serviceFAQ.destroy();

        res.status(200).json({ message: 'ServiceFAQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting serviceFAQ', error: error.message });
    }
};

module.exports = {
    create,
    getAllServiceFAQs,
    getServiceFAQById,
    updateServiceFAQ,
    deleteServiceFAQ,
    getAllServiceFAQsByType
};
