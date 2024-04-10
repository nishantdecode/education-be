// controllers/collegeController.js
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
    // const college = await createCollege(req.body);
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
    // const result = [];
    for (let college of colleges) {
      let rating = college.rating;
      let review = college.review_count;
      if (rating) {
        rating = parseFloat(rating.split("/")[0]);
      }
      if (review) {
        review = parseInt(review.split(" ")[0].trim().substr(1));
      }
      console.log({course:college.course_info});
      // result.push();
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
// let filters = {
//   where: {
//     [Op.and]: [],
//     data: {},
//   },
// };

const getAllColleges = async (req, res) => {
  try {
    let { page, show } = req.query;
    const { rating } = req.body;
 
    let filters = {
      where: {},
    };
 
    if (page) {
      page = parseInt(page);
    }
    if (show) {
      show = parseInt(show);
    }
 
    if (rating && rating.length > 0) {
      filters.where.rating = {
        [Op.in]: rating.map(Number),
      };
    }
 
    let colleges;
    if (page && show) {
      colleges = await College.findAll({
        ...filters,
        offset: (page - 1) * show,
        limit: show,
      });
    } else {
      colleges = await College.findAll(filters);
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
    res.status(500).json({ message: "Error retrieving colleges", error: error.message });
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
  getCollegeById,
  updateCollege,
  deleteCollege,
  importCollegeData,
};
