const { Course, createCourse } = require("../models/course");
const excelToJson = require("convert-excel-to-json");
const fs = require("fs");
const { Op } = require("sequelize"); // Import Sequelize's Op
const csv = require("csv-parser");

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

//
const importCourseData = async (req, res) => {
  try {
    const csvFile = req.file;
    const { platform } = req.query;

    const results = [];

    fs.createReadStream(csvFile.path)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("end", async () => {
        if (platform === "Udemy") {
          for (let row of results) {
            let {
              title,
              url,
              price,
              Language,
              Level,
              enrollments,
              rating,
              "Number of Reviews": reviews,
              "Number of Lectures": lectures,
              category,
              subtitles,
              Time,
            } = row;

            if (typeof price === "string") {
              price = price.trim();
              if (price.toUpperCase() === "FREE") {
                price = 0;
              } else {
                price = parseFloat(price.replace(/[^0-9.]/g, ""));
              }
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

            // console.log({
            //   title,
            //   url,
            //   price,
            //   language: Language,
            //   level: Level,
            //   platform,
            //   numberOfEnrollments: enrollments,
            //   averageRating: rating,
            //   mode: "ONLINE",
            //   reviews,
            //   duration: Time,
            //   imageUrl: "/images/udemy1.png",
            // });

            await createCourse({
              title,
              url,
              price,
              language: Language,
              level: Level,
              platform,
              numberOfEnrollments: enrollments,
              averageRating: rating,
              mode: "ONLINE",
              reviews,
              duration: Time,
              imageUrl: "/images/udemy1.png",
            });
          }
        }

        if (platform === "Coursera") {
          for (let row of results) {
            let {
              title,
              url,
              price,
              Language,
              Level,
              enrollments,
              rating,
              "Rating Count": reviews,
              Mode,
              category,
              subtitles,
              duration,
              organisation,
              "Course Package": package,
              "Course Projects": project,
            } = row;

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
            if (reviews) {
              if (reviews === "NA") {
                reviews = 0;
              } else {
                reviews = parseFloat(reviews);
              }
            }

            // console.log({
            //   title,
            //   url,
            //   price,
            //   language: Language,
            //   level: Level,
            //   platform,
            //   numberOfEnrollments: enrollments,
            //   averageRating: rating,
            //   mode: "ONLINE",
            //   reviews,
            //   duration, //double int could be extracted
            //   organisation,
            //   imageUrl: "/images/coursera.png",
            // });

            await createCourse({
              title,
              url,
              price,
              language: Language,
              level: Level,
              platform,
              numberOfEnrollments: enrollments,
              averageRating: rating,
              mode: "ONLINE",
              reviews,
              duration, //double int could be extracted
              organisation,
              imageUrl: "/images/coursera.png",
            });
          }
        }
        if (platform === "Skillshare") {
          for (let row of results) {
            let {
              title,
              url,
              Level,
              enrollments,
              rating,
              duration,
              instructor,
              "Related Skills": skill,
            } = row;

            if (enrollments) {
              enrollments = parseInt(enrollments);
            }
            if (rating) {
              rating = parseFloat(rating);
            }

            // console.log({
            //   title,
            //   url,
            //   language: "English", //language info not provided
            //   level: Level,
            //   platform,
            //   numberOfEnrollments: enrollments,
            //   averageRating: rating,
            //   mode: "ONLINE",
            //   duration,
            //   organisation: platform,
            //   instructor,
            //   imageUrl: "/images/skillshare.png",
            // });

            await createCourse({
              title,
              url,
              language: "English", //language info not provided
              level: Level,
              platform,
              numberOfEnrollments: enrollments,
              averageRating: rating,
              mode: "ONLINE",
              duration,
              organisation: platform,
              instructor,
              imageUrl: "/images/skillshare.png",
            });
          }
        }
        if (platform === "Edx") {
          for (let row of results) {
            let {
              h1,
              url,
              price,
              language,
              level,
              enrollments,
              time_duration,
              institution,
            } = row;

            if (price === "FREE") {
              price = 0;
            } else if (price) {
              price = parseFloat(price);
            }
            if (enrollments) {
              if (enrollments === "-") {
                enrollments = 0;
              } else {
                enrollments = parseInt(enrollments);
              }
            }

            // console.log({
            //   title: h1,
            //   url,
            //   price,
            //   language,
            //   level,
            //   platform,
            //   numberOfEnrollments: enrollments,
            //   mode: "ONLINE",
            //   duration: time_duration,
            //   organisation: institution,
            //   imageUrl: "/images/edx.png"
            // })

            await createCourse({
              title: h1,
              url,
              price,
              language,
              level,
              platform,
              numberOfEnrollments: enrollments,
              mode: "ONLINE",
              duration: time_duration,
              organisation: institution,
              imageUrl: "/images/edx.png",
            });
          }
        }
      });

    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    let { page, show, search } = req.query;
    let { languages, minFees, maxFees, modes, platforms } = req.body;

    const filters = {
      where: {
        [Op.and]: [],
      },
    };

    console.log(req.body);
    if (search) {
      filters.where.title = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (modes && modes.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: modes.map((md) => ({
          mode: {
            [Op.iLike]: `%${md}%`,
          }, // Match any date in the array
        })),
      });
    }
    if (platforms && platforms.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: platforms.map((p) => ({
          platform: {
            [Op.iLike]: `%${p}%`,
          }, // Match any date in the array
        })),
      });
    }
    if (languages && languages.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: languages.map((lng) => ({
          language: {
            [Op.iLike]: `%${lng}%`,
          }, // Match any date in the array
        })),
      });
    }

    if (platforms && platforms.includes("Skillshare")) {
      if (minFees || maxFees) {
        const feeFilters = {
          [Op.or]: [
            { platform: { [Op.iLike]: "Skillshare" } },
            {
              price: {
                ...(minFees && { [Op.gte]: minFees }),
                ...(maxFees && { [Op.lte]: maxFees }),
              },
            },
          ],
        };
        filters.where[Op.and].push(feeFilters);
      }
    } else {
      if (minFees) {
        filters.where.price = {
          [Op.gte]: minFees,
        };
      }
      if (maxFees) {
        if (filters.where.price) {
          filters.where.price[Op.lte] = maxFees;
        } else {
          filters.where.price = {
            [Op.lte]: maxFees,
          };
        }
      }
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
      courses = await Course.findAll({ ...filters });
    }
    const totalCount = await Course.count({ ...filters });

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

const getFilterData = async (req, res) => {
  try {
    const filterData = await Course.aggregate("platform", "DISTINCT", {
      plain: false,
    });
    const platforms = filterData.map((item) => item.DISTINCT);

    const languages = await Course.aggregate("language", "DISTINCT", {
      plain: false,
    });
    const languagesList = languages.map((item) => item.DISTINCT);

    const modes = await Course.aggregate("mode", "DISTINCT", { plain: false });
    const modesList = modes.map((item) => item.DISTINCT);

    const minPrice = await Course.min("price");
    const maxPrice = await Course.max("price");
    console.log(maxPrice);

    // Construct the response object
    const filterObject = {
      platforms,
      languages: languagesList,
      modes: modesList,
      minPrice,
      maxPrice,
    };
    res
      .status(200)
      .json({ message: "Filter data retrieved successfully", filterObject });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving course", error: error.message });
  }
};

//
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

//
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

//
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
  getFilterData,
  getCourseById,
  updateCourse,
  deleteCourse,
  importCourseData,
};
