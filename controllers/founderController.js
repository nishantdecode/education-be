// controllers/videoController.js
const { create } = require('../models/founder');
const { Founder } = require('../models/founder'); // Import the Founder model

const add = async (req, res) => {
    const { name, designation, message } = req.body;
    const newFounder = await create({ name, designation, message });
    res.json({ message: 'Founder added successfully', founder: newFounder });
}

const updateFounder = async (req, res) => {
    const founderId = parseInt(req.params.id);
    const { name, designation, message } = req.body;

    try {
        const founderToUpdate = await Founder.findByPk(founderId);

        if (!founderToUpdate) {
            return res.status(404).json({ message: 'Founder not found' });
        }

        // Update the founder properties
        founderToUpdate.name = name;
        founderToUpdate.designation = designation;
        founderToUpdate.message = message;

        // Save the updated founder
        await founderToUpdate.save();

        res.json({ message: 'Founder updated successfully', founder: founderToUpdate });
    } catch (error) {
        console.error('Error updating founder:', error);
        res.status(500).json({ message: 'Error updating founder', error: error.message });
    }
}

const getAllFounders = async (req, res) => {
    try {
        const founders = await Founder.findAll();
        res.status(200).json({ message: 'All founders retrieved successfully', founders });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving founders', error: error.message });
    }
};

module.exports = {
    add,
    updateFounder,
    getAllFounders
};
