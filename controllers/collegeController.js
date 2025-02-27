const { College, createCollege } = require("../models/college");
const data1 = require("../data/college_data_final1.json");
const data2 = require("../data/college_data_final2.json");
const data3 = require("../data/college_data_final3.json");
const data4 = require("../data/college_data_final4.json");
const data5 = require("../data/college_data_final5.json");
const data6 = require("../data/college_data_final6.json");
const data7 = require("../data/college_data_final7.json");
const data8 = require("../data/college_data_final8.json");
const data9 = require("../data/college_data_final9.json");
const { Op } = require("sequelize");
const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

const create = async (req, res) => {
  try {
    const college = await createCollege(req.body);
    res.status(201).json({ message: "College created successfully", college });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating college", error: error.message });
  }
};
const importCollegeData = async (req, res) => {
  try {
    const colleges = [
      ...data1,
      ...data2,
      ...data3,
      ...data4,
      ...data5,
      ...data6,
      ...data7,
      ...data8,
      ...data9,
    ];
    for (let college of colleges) {
      let rating = college.rating;
      let review = college.review_count;
      if (rating) {
        rating = parseFloat(rating.split("/")[0]);
      }
      if (review) {
        review = parseInt(review.split(" ")[0].trim().substr(1));
      }
      await createCollege({
        name: college.clgname,
        course_data: college.course_info,
        url: college.url,
        location: college.location,
        rating: rating,
        review: review,
        infrastructure: college.infrastructure,
        specialization: college.specialization,
        admission: college.admission,
        features_rating: college.features_rating,
        other_facilities: college.other_facilities,
      });
    }
    res.status(201).json({ message: "College created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating college", error: error.message });
  }
};

const getAllColleges = async (req, res) => {
  try {
    let { page, show, search } = req.query;
    let { locations, minFees, maxFees, courses, ratings } = req.body;

    console.log(ratings);
    minFees = minFees ? parseInt(minFees, 10) : null;
    maxFees = maxFees ? parseInt(maxFees, 10) : null;

    const filters = {
      where: {
        [Op.and]: [],
      },
    };

    if (search) {
      filters.where[Op.or] = {
        name: {
          [Op.iLike]: `%${search}%`,
        },
        location: {
          [Op.iLike]: `%${search}%`,
        },
        // Add more columns as needed
      };
    }

    if (courses && courses.length > 0) {
      filters.where[Op.and].push({
        specialization: {
          [Op.overlap]: courses,
        },
      });
    }

    if (locations && locations.length > 0) {
      const locationFilters = locations.map((lng) => ({
        location: {
          [Op.iLike]: `%${lng}%`,
        },
      }));
      filters.where[Op.and].push({ [Op.or]: locationFilters });
    }

    if (minFees !== null) {
      filters.where.fees = {
        [Op.gte]: minFees,
      };
    }

    if (maxFees !== null) {
      if (filters.where.fees) {
        filters.where.fees[Op.lte] = maxFees;
      } else {
        filters.where.fees = {
          [Op.lte]: maxFees,
        };
      }
    }

    if (ratings && ratings.length > 0) {
      const ratingFilters = ratings.map((r) => {
        const rating = parseFloat(r);
        console.log(rating);
        return {
          rating: {
            [Op.gte]: parseFloat(rating),
            [Op.lt]: parseFloat(rating + 1),
          },
        };
      });

      filters.where[Op.and].push({ [Op.or]: ratingFilters });
    }

    if (page) {
      page = parseInt(page);
    }
    if (show) {
      show = parseInt(show);
    }

    let colleges;
    if (page && show) {
      colleges = await College.findAll({
        ...filters,
        offset: (page - 1) * show,
        limit: show,
      });
    } else {
      colleges = await College.findAll({ ...filters });
    }

    const totalCount = await College.count(filters);

    res.status(200).json({
      message: "All colleges retrieved successfully",
      colleges,
      currentPage: page,
      totalPage: Math.ceil(totalCount / show),
      totalCount: totalCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving colleges", error: error.message });
  }
};

const getFilterData = async (req, res) => {
  try {
    // Get distinct locations
    const filterData = await College.aggregate("location", "DISTINCT", {
      plain: false,
    });
    const locations = filterData.map((item) => item.DISTINCT);

    // Get distinct specializations
    const result = await sequelize.query(
      `
      SELECT DISTINCT UNNEST(specialization) AS specialization
      FROM "Colleges"
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const courses = [...new Set(result.map((row) => row.specialization))];

    // Get min and max fees
    const minPrice = await College.min("fees");
    const maxPrice = await College.max("fees");

    // Construct the response object
    const filterObject = {
      locations,
      courses,
      minPrice,
      maxPrice,
    };

    res
      .status(200)
      .json({ message: "Filter data retrieved successfully", filterObject });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving filter data", error: error.message });
  }
};

const getCollegeById = async (req, res) => {
  const { id } = req.params;

  try {
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res
      .status(200)
      .json({ message: "College retrieved successfully", college });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving college", error: error.message });
  }
};

const updateCollege = async (req, res) => {
  const { id } = req.params;

  try {
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    await college.update(req.body);

    res.status(200).json({ message: "College updated successfully", college });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating college", error: error.message });
  }
};

const deleteCollege = async (req, res) => {
  const { id } = req.params;

  try {
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    await college.destroy();

    res.status(200).json({ message: "College deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting college", error: error.message });
  }
};

module.exports = {
  create,
  getAllColleges,
  getFilterData,
  getCollegeById,
  updateCollege,
  deleteCollege,
  importCollegeData,
};
