// controllers/courseController.js
const { Course, createCourse } = require("../models/course");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");
const { Op } = require("sequelize"); // Import Sequelize's Op

const create = async (req, res) => {
  try {
    const course = await createCourse(req.body);
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};
const importCourseData = async (req, res) => {
  try {
    // const course = await createCourse(req.body);
    // const excel = req.file;
    const excel = req.files.file;
    const file = fs.readFileSync(excel.tempFilePath);
    const { platform } = req.query;
    const result = excelToJson({
      source: file, // fs.readFileSync return a Buffer
    });
    //   console.log({result})
    // const promises = [];
    if (platform === "Udemy") {
      for (let row of result?.Sheet1) {
        let title = row.A;
        let url = row.B;
        let price = row.C;
        let language = row.D;
        let level = row.E;
        let enrollments = row.F;
        let rating = row.G;
        let reviews = row.H;
        let lectures = row.I;
        let category = row.J;
        let subtitles = row.K;
        let duration = row.L;

        if (price === "FREE") {
          price = 0;
        } else if (price) {
          price = parseFloat(price.slice(1, price.length));
        }
        if (enrollments) {
          enrollments = parseInt(enrollments);
        }
        if (rating) {
          rating = parseFloat(rating);
        }
        if (reviews) {
          reviews = parseInt(reviews);
        }
        await createCourse({
          title,
          platform,
          duration,
          mode: "ONLINE",
          language,
          reviews,
          averageRating: rating,
          price,
          numberOfEnrollments: enrollments,
          level,
          url,
        });
      }
    }
    if (platform === "Coursea") {
      for (let row of result?.Sheet1) {
        let url = row.A;
        let title = row.B;
        let organization = row.C;
        let rating = row.D;
        let enrollments = row.F;
        let level = row.H;
        let duration = row.I;
        let language = row.J;
        let price = row.L;
        // let reviews = row.H;
        // let lectures = row.I;
        // let category = row.J;
        // let subtitles = row.K;

        if (price === "FREE") {
          price = 0;
        } else if (price) {
          price = parseFloat(price);
        }
        if (enrollments) {
          enrollments = parseInt(enrollments);
        }
        if (rating) {
          if (rating === "NA") {
            rating = 0;
          } else {
            rating = parseFloat(rating);
          }
        }

        await createCourse({
          title,
          platform,
          duration,
          mode: "ONLINE",
          language,
          averageRating: rating,
          price,
          numberOfEnrollments: enrollments,
          level,
          url,
          organization,
        });
      }
    }
    if (platform === "Skillshare") {
      for (let row of result?.Sheet1) {
        let url = row.A;
        let title = row.B;
        let enrollments = row.D;
        let level = row.E;
        let duration = row.F;
        let instructor = row.G;
        let rating = row.I;
        // let organization = row.C
        // let language = row.J;
        // let price = row.L;
        // let reviews = row.H;
        // let lectures = row.I;
        // let category = row.J;
        // let subtitles = row.K;

        // if(price === "FREE"){
        //     price = 0
        // }else if(price) {
        //     price = parseFloat(price.slice(1,price.length));
        // }
        if (enrollments) {
          enrollments = parseInt(enrollments);
        }
        if (rating) {
          rating = parseFloat(rating);
        }

        await createCourse({
          title,
          platform,
          duration,
          mode: "ONLINE",
          // language,
          averageRating: rating,
          // price,
          instructor,
          numberOfEnrollments: enrollments,
          level,
          url,
          // organization:platform
        });
      }
    }
    if (platform === "Edx") {
      for (let row of result?.Sheet1) {
        let enrollments = row.A;
        let title = row.B;
        let organization = row.C;
        let language = row.D;
        let level = row.E;
        let price = row.G;
        let duration = row.I;
        let url = row.J;
        // let rating = row.D;
        // let reviews = row.H;
        // let lectures = row.I;
        // let category = row.J;
        // let subtitles = row.K;

        if (price === "FREE") {
          price = 0;
        } else if (price) {
          price = parseFloat(price);
        }
        if (enrollments) {
          console.log({ enrollments });
          if (enrollments === "-") {
            enrollments = 0;
          } else {
            enrollments = parseInt(enrollments);
          }
          console.log({ enrollments });
        }
        // if(rating){
        //     rating = parseFloat(rating)
        // }

        await createCourse({
          title,
          platform,
          duration,
          mode: "ONLINE",
          language,
          // averageRating:rating,
          price,
          numberOfEnrollments: enrollments,
          level,
          url,
          organization,
        });
      }
    }
    // await Promise.all(promises);

    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};
const getAllCourses = async (req, res) => {
  try {
    let { page, show,search } = req.query;
    let {languages} = req.body;
    const filters = {
      where: {
      },
    }
    if(languages && languages.length>0){
      filters.where[Op.or]= languages.map(lng => ({
        'language': {
          [Op.iLike]: `%${lng}%`
        } // Match any date in the array
      }))
    }
    if (page) {
      page = parseInt(page);
    }
    if (show) {
      show = parseInt(show);
    }
    let courses;
    if (page && show) {
      courses = await Course.findAll({
        ...filters,
        offset: (page - 1) * show,
        limit: show,
      });
    } else {
      courses = await Course.findAll({...filters});
    }
    const totalCount = await Course.count({...filters});

    res.status(200).json({
      message: "All courses retrieved successfully",
      courses,
      currentPage: page,
      totalPage: Math.ceil(totalCount / show),
      totalCount: totalCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving courses", error: error.message });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course retrieved successfully", course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving course", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.update(req.body);

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.destroy();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};

module.exports = {
  create,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  importCourseData,
};
