// controllers/courseController.js
const { Course, createCourse } = require('../models/course');

const create = async (req, res) => {
    try {
        const course = await createCourse(req.body);
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.status(200).json({ message: 'All courses retrieved successfully', courses });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving courses', error: error.message });
    }
};

const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course retrieved successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving course', error: error.message });
    }
};

const updateCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.update(req.body);

        res.status(200).json({ message: 'Course updated successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error: error.message });
    }
};

const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findByPk(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.destroy();

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
};

module.exports = {
    create,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};
