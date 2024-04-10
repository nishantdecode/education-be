const { Coaching, createCoaching } = require("../models/coaching");
const { Op } = require("sequelize");
// Create a coaching
const create = async (req, res) => {
  try {
    console.log("regbodyback",req.bo)
    const coaching = await createCoaching(req.body);

    res
      .status(201)
      .json({ message: "Coaching created successfully", coaching });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating coaching", error: error.message });
  }
};

// Get all coachings
const getAllCoachings = async (req, res) => {
  try {
    let { page,show,search } = req.query;
    // let { minRate, maxRate, minLoan, maxLoan } = req.body;
    const {
      locations,
      specializations,
      minFees,
      maxFees,
      ratings,
      minSeats,
      maxSeats,
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

    if (minFees) {
      filters.where.data.fees = {
        min: {
          [Op.gt]: minFees,
        },
      };
    }
    if (maxFees) {
      if (filters.where.data?.fees) {
        filters.where.data.fees.max = { [Op.lt]: maxFees };
      } else {
        filters.where.data.fees = {
          max: {
            [Op.lt]: maxFees,
          },
        };
      }
    }
    if (minSeats) {
      filters.where.data.seats = {
        [Op.gt]: minSeats,
      };
    }
    if (maxSeats) {
      if (filters.where.data?.seats) {
        filters.where.data.seats[Op.lte] = maxSeats;
      } else {
        filters.where.data.seats = {
          [Op.lt]: maxSeats,
        };
      }
    }
    if (specializations && specializations.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: specializations.map((s) => ({
          "data.specialization": {
            [Op.iLike]: `%${s}%`,
          }, // Match any date in the array
        })),
      });
    }
    if (ratings && ratings.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: ratings.map((r) => ({
          "data.rating": {
            [Op.iLike]: `%${r}%`,
          }, // Match any date in the array
        })),
      });
    }
    if (locations && locations.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: locations.map((l) => ({
          "data.location": {
            [Op.iLike]: `%${l}%`,
          }, // Match any date in the array
        })),
      });
    }
    if (page) {
      page = parseInt(page);
    }
    if (show) {
      show = parseInt(show);
    }
    let coachings;
    if (page && show) {
      coachings = await Coaching.findAll({
        ...filters,
        offset: (page - 1) * show,
        limit: show,
      });
    } else {
      coachings = await Coaching.findAll({ ...filters });
    }
    const totalCount = await Coaching.count({ ...filters });
    res.status(200).json({
      message: "All coachings retrieved successfully",
      coachings,
      currentPage: page,
      totalPage: Math.ceil(totalCount / show),
      totalCount: totalCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving coachings", error: error.message });
  }
};

// Get a coaching by ID
const getCoachingById = async (req, res) => {
  const { id } = req.params;

  try {
    const coaching = await Coaching.findByPk(id);
    if (!coaching) {
      return res.status(404).json({ message: "Coaching not found" });
    }
    res
      .status(200)
      .json({ message: "Coaching retrieved successfully", coaching });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving coaching", error: error.message });
  }
};

// Update a coaching by ID
const updateCoaching = async (req, res) => {
  const { id } = req.params;

  try {
    const coaching = await Coaching.findByPk(id);
    if (!coaching) {
      return res.status(404).json({ message: "Coaching not found" });
    }

    await coaching.update({ data: req.body });

    res
      .status(200)
      .json({ message: "Coaching updated successfully", coaching });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating coaching", error: error.message });
  }
};

// Delete a coaching by ID
const deleteCoaching = async (req, res) => {
  const { id } = req.params;

  try {
    const coaching = await Coaching.findByPk(id);
    if (!coaching) {
      return res.status(404).json({ message: "Coaching not found" });
    }

    await coaching.destroy();

    res.status(200).json({ message: "Coaching deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting coaching", error: error.message });
  }
};

module.exports = {
  create,
  getAllCoachings,
  getCoachingById,
  updateCoaching,
  deleteCoaching,
};
