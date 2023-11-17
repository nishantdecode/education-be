const { Coaching, createCoaching } = require('../models/coaching');

// Create a coaching
const create = async (req, res) => {
    try {
        const coaching = await createCoaching(req.body);
        res.status(201).json({ message: 'Coaching created successfully', coaching });
    } catch (error) {
        res.status(500).json({ message: 'Error creating coaching', error: error.message });
    }
};

// Get all coachings
const getAllCoachings = async (req, res) => {
    try {
        const coachings = await Coaching.findAll();
        res.status(200).json({ message: 'All coachings retrieved successfully', coachings });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coachings', error: error.message });
    }
};

// Get a coaching by ID
const getCoachingById = async (req, res) => {
    const { id } = req.params;

    try {
        const coaching = await Coaching.findByPk(id);
        if (!coaching) {
            return res.status(404).json({ message: 'Coaching not found' });
        }
        res.status(200).json({ message: 'Coaching retrieved successfully', coaching });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coaching', error: error.message });
    }
};

// Update a coaching by ID
const updateCoaching = async (req, res) => {
    const { id } = req.params;

    try {
        const coaching = await Coaching.findByPk(id);
        if (!coaching) {
            return res.status(404).json({ message: 'Coaching not found' });
        }

        await coaching.update({ data: req.body });

        res.status(200).json({ message: 'Coaching updated successfully', coaching });
    } catch (error) {
        res.status(500).json({ message: 'Error updating coaching', error: error.message });
    }
};

// Delete a coaching by ID
const deleteCoaching = async (req, res) => {
    const { id } = req.params;

    try {
        const coaching = await Coaching.findByPk(id);
        if (!coaching) {
            return res.status(404).json({ message: 'Coaching not found' });
        }

        await coaching.destroy();

        res.status(200).json({ message: 'Coaching deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting coaching', error: error.message });
    }
};

module.exports = {
    create,
    getAllCoachings,
    getCoachingById,
    updateCoaching,
    deleteCoaching,
};
