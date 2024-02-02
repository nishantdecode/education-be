// controllers/collegeController.js
const { College, createCollege } = require("../models/college");
const data1 = require("../data/college_data_final1.json");
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
    const colleges = data1;
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
      // result.push();
      await createCollege({
        name: college.clgname,
        course_data: college.course_info,
        url: college.url,
        location: college.location,
        rating:rating,
        review:review,
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
    const colleges = await College.findAll();
    res
      .status(200)
      .json({ message: "All colleges retrieved successfully", colleges });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving colleges", error: error.message });
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
