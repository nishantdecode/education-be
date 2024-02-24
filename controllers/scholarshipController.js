const { Scholarship, createScholarship } = require("../models/scholarship");

// Create a scholarship
const create = async (req, res) => {
  try {
    const scholarship = await createScholarship(req.body);
    res
      .status(201)
      .json({ message: "Scholarship created successfully", scholarship });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating scholarship", error: error.message });
  }
};

// Get all scholarships
const getAllScholarships = async (req, res) => {
  try {
    let { page, show } = req.query;
    if (page) {
      page = parseInt(page);
    }
    if (show) {
      show = parseInt(show);
    }
    let scholarships;
    if (page && show) {
      scholarships = await Scholarship.findAll({
        offset: (page - 1) * show,
        limit: show,
      });
    } else {
      scholarships = await Scholarship.findAll();
    }
    const totalCount = await Scholarship.count();

    res
      .status(200)
      .json({
        message: "All scholarships retrieved successfully",
        scholarships,
        currentPage: page,
        totalPage:Math.ceil(totalCount/show),
        totalCount: totalCount,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving scholarships", error: error.message });
  }
};

// Get a scholarship by ID
const getScholarshipById = async (req, res) => {
  const { id } = req.params;

  try {
    const scholarship = await Scholarship.findByPk(id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }
    res
      .status(200)
      .json({ message: "Scholarship retrieved successfully", scholarship });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving scholarship", error: error.message });
  }
};

// Update a scholarship by ID
const updateScholarship = async (req, res) => {
  const { id } = req.params;

  try {
    const scholarship = await Scholarship.findByPk(id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    await scholarship.update({ data: req.body });

    res
      .status(200)
      .json({ message: "Scholarship updated successfully", scholarship });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating scholarship", error: error.message });
  }
};

// Delete a scholarship by ID
const deleteScholarship = async (req, res) => {
  const { id } = req.params;

  try {
    const scholarship = await Scholarship.findByPk(id);
    if (!scholarship) {
      return res.status(404).json({ message: "Scholarship not found" });
    }

    await scholarship.destroy();

    res.status(200).json({ message: "Scholarship deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting scholarship", error: error.message });
  }
};

module.exports = {
  create,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
};
