const { Scholarship, createScholarship } = require("../models/scholarship");
const { Op } = require("sequelize"); // Import Sequelize's Op

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
    let { page, show, search } = req.query;
    let {
      price : [minAmount, maxAmount],
      "scholarship type": type,
      "offered by": offeredBy,
      "intake year": inTakeYear,
      minDeadLine,
      maxDeadLine,
    } = req.body;

    let filters = {
      where: {
        [Op.and]: [],
        data: {},
      },
    };
    if (search) {
      filters.where.data.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (minAmount) {
      filters.where.data.amount = {
        [Op.gte]: minAmount,
      };
    }
    if (maxAmount) {
      if (filters.where.data?.amount) {
        filters.where.data.amount[Op.lte] = maxAmount;
      } else {
        filters.where.data.amount = {
          [Op.lte]: maxAmount,
        };
      }
    }

    if (type && type.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: type.map((item) => ({
          "data.eligibility": {
            [Op.iLike]: `%${item}%`,
          },
        })),
      });
    }

    if (inTakeYear && inTakeYear.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: inTakeYear.map((year) => ({
          "data.forYear": {
            [Op.iLike]: `%${year}%`,
          },
        })),
      });
    }

    if (offeredBy && offeredBy.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: offeredBy.map((offer) => ({
          "data.organization": {
            [Op.iLike]: `%${offer}%`,
          }, // Match any date in the array
        })),
      });
    }

    if (minDeadLine) {
      filters.where.data.importantDates = {
        ["submission Date"]: {
          [Op.gte]: new Date(minDeadLine),
        },
      };
    }
    if (maxDeadLine) {
      if (filters.where.data.importantDates?.["submission Date"]) {
        filters.where.data.importantDates["submission Date"][Op.lte] = new Date(
          maxDeadLine
        );
      } else {
        filters.where.data.importantDates = {
          ["submission Date"]: {
            [Op.lte]: new Date(maxDeadLine),
          },
        };
      }
    }
    if (page) {
      page = parseInt(page);
    }
    if (show) {
      show = parseInt(show);
    }
    let scholarships;
    if (page && show) {
      scholarships = await Scholarship.findAll({
        ...filters,
        offset: (page - 1) * show,
        limit: show,
      });
    } else {
      scholarships = await Scholarship.findAll({ ...filters });
    }
    const totalCount = await Scholarship.count({ ...filters });

    res.status(200).json({
      message: "All scholarships retrieved successfully",
      scholarships,
      currentPage: page,
      totalPage: Math.ceil(totalCount / show),
      totalCount: totalCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving scholarships", error: error.message });
  }
};

const getFilterData = async (req, res) => {
  try {
    // Fetch all data objects
    const allScholarships = await Scholarship.findAll();

    const distinctEligibility = [
      ...new Set(
        allScholarships.map((item) => item.data?.eligibility).filter(Boolean)
      ),
    ];
    const distinctOrganization = [
      ...new Set(
        allScholarships.map((item) => item.data?.organization).filter(Boolean)
      ),
    ];
    const distinctForYear = [
      ...new Set(
        allScholarships.map((item) => item.data?.forYear).filter(Boolean)
      ),
    ];
    const distinctSubmissionDate = [
      ...new Set(
        allScholarships
          .map((item) => item.data?.importantDates?.["submission Date"])
          .filter(Boolean)
      ),
    ];
    const amounts = allScholarships
      .map((item) => item.data?.amount)
      .filter((amount) => amount !== undefined && amount !== null);
    const minAmount = amounts.length > 0 ? Math.min(...amounts) : undefined;
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : undefined;

    // Construct the response object
    const filterObject = {
      eligibility: distinctEligibility,
      organization: distinctOrganization,
      forYear: distinctForYear,
      submissionDate: distinctSubmissionDate,
      priceRange: {
        minAmount: minAmount,
        maxAmount: maxAmount,
      },
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
  getFilterData,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
};
