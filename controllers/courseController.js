// controllers/courseController.js
const { Course, createCourse } = require('../models/course');
const excelToJson = require("convert-excel-to-json");
const fs = require('fs')
const create = async (req, res) => {
    try {
        const course = await createCourse(req.body);
        res.status(201).json({ message: 'Course created successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
};
const importCourseData = async (req, res) => {
    try {
        // const course = await createCourse(req.body);
        // const excel = req.file;
        const excel = req.files.file
        const file = fs.readFileSync(excel.tempFilePath)
        // const {platform} = req.query;
        const result = excelToJson({
            source: file, // fs.readFileSync return a Buffer
          });
        const promises = [];
        if(platform === "Udemy"){
            for await (let row of result?.Sheet1) {
                const title = row.A;
                const url = row.B;
                let price = row.C;
                const language = row.D;
                const level = row.E;
                let enrollments = row.F;
                const rating = row.G;
                const reviews = row.H;
                const lectures = row.I;
                const category = row.J;
                const subtitles = row.K;
                const duration = row.L;

                if(price === "FREE"){
                    price = 0
                }else if(price) {
                    price = parseFloat(price.slice(1,price.length));
                }
                if(enrollments){
                    enrollments = parseInt(enrollments)
                }
                if(rating){
                    rating = parseFloat(rating)
                }
                if(reviews){
                    reviews = parseInt(reviews)
                }
                promises.push(createCourse({
                    title,
                    platform,
                    duration,
                    mode:"ONLINE",
                    language,
                    reviews,
                    averageRating:rating,
                    price,
                    numberOfEnrollments:enrollments,
                    level,
                    url,
                }))
            }
        }
        await Promise.all(promises);
          
        res.status(201).json({ message: 'Course created successfully' });
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
    importCourseData
};
