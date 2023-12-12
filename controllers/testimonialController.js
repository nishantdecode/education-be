const { Testimonial } = require('../models/testimonial');
const { createTestimonial } = require('../models/testimonial');

const createAdd = async (req, res) => {
    const { name, age, message, imageUrl, serviceName, question1Rating, question2Rating, question3Rating } = req.body;

    try {
        const testimonial = await createTestimonial({ name, age, message, imageUrl, serviceName, question1Rating, question2Rating, question3Rating });
        res.status(201).json({ message: 'Testimonial created successfully', testimonial });
    } catch (error) {
        res.status(500).json({ message: 'Error creating testimonial', error: error.message });
    }
};

const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.findAll();
        res.status(200).json({ message: 'All testimonials retrieved successfully', testimonials });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving testimonials', error: error.message });
    }
};

const getTestimonialById = async (req, res) => {
    const { id } = req.params;

    try {
        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }
        res.status(200).json({ message: 'Testimonial retrieved successfully', testimonial });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving testimonial', error: error.message });
    }
};

const updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { name, age, message, imageUrl, serviceName, question1Rating, question2Rating, question3Rating } = req.body;

    try {
        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        testimonial.name = name;
        testimonial.age = age;
        testimonial.message = message;
        testimonial.imageUrl = imageUrl;
        testimonial.serviceName = serviceName;
        testimonial.question1Rating = question1Rating;
        testimonial.question2Rating = question2Rating;
        testimonial.question3Rating = question3Rating;

        await testimonial.save();

        res.status(200).json({ message: 'Testimonial updated successfully', testimonial });
    } catch (error) {
        res.status(500).json({ message: 'Error updating testimonial', error: error.message });
    }
};

const deleteTestimonial = async (req, res) => {
    const { id } = req.params;

    try {
        const testimonial = await Testimonial.findByPk(id);
        if (!testimonial) {
            return res.status(404).json({ message: 'Testimonial not found' });
        }

        await testimonial.destroy();

        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
    }
};

module.exports = {
    createAdd,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
};
