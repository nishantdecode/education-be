const { Coaching, createCoaching } = require("../models/coaching");
const { DataTypes, Op, fn, col} = require("sequelize");
const sequelize = require('../config/db');
// Create a coaching
const create = async (req, res) => {
  try {
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
    let { page, show, search } = req.query;
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
      },
    };

    if (search) {
      filters.where[Op.or] = [
        sequelize.where(sequelize.json('data.name'), Op.iLike, `%${search}%`),
        sequelize.where(sequelize.json('data.location'), Op.iLike, `%${search}%`)
      ];
    }

    if (ratings && ratings.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: ratings.map((r) => ({
          "data.ratings": r.toString()
        }))
      });
    }

    if (minFees) {
      filters.where[Op.and].push(
        sequelize.where(sequelize.cast(sequelize.json('data.fees.min'), 'INTEGER'), Op.gte, minFees)
      );
    }
    if (maxFees) {
      filters.where[Op.and].push(
        sequelize.where(sequelize.cast(sequelize.json('data.fees.max'), 'INTEGER'), Op.lte, maxFees)
      );
    }
    if (minSeats) {
      filters.where[Op.and].push(
        sequelize.where(sequelize.cast(sequelize.json('data.seats'), 'INTEGER'), Op.gte, minSeats)
      );
    }
    if (maxSeats) {
      filters.where[Op.and].push(
        sequelize.where(sequelize.cast(sequelize.json('data.seats'), 'INTEGER'), Op.lte, maxSeats)
      );
    }

    if (specializations && specializations.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: specializations.map((s) => ({
          "data.specialization": {
            [Op.iLike]: `%${s}%`,
          },
        })),
      });
    }

    if (locations && locations.length > 0) {
      filters.where[Op.and].push({
        [Op.or]: locations.map((l) => ({
          "data.location": {
            [Op.iLike]: `%${l}%`,
          },
        })),
      });
    }

    page = page ? parseInt(page) : 1;
    show = show ? parseInt(show) : 10;

    const { rows: coachings, count: totalCount } = await Coaching.findAndCountAll({
      ...filters,
      offset: (page - 1) * show,
      limit: show,
    });

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

const getFilterData = async (req, res) => {
  try {
    // Extract distinct locations from JSONB field
    const locationsData = await Coaching.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.literal('data->>\'location\'')), 'location'],
      ],
      raw: true,
    });
    const locations = locationsData.map(item => item.location);

    // Extract distinct courses from JSONB field
    const coursesData = await Coaching.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.literal('data->>\'course\'')), 'course'],
      ],
      raw: true,
    });
    const coursesList = coursesData.map(item => item.course);

    // Extract min and max fees from nested JSONB fields
    const minFeesData = await Coaching.findAll({
      attributes: [[sequelize.fn('MIN', sequelize.cast(sequelize.literal('data->\'fees\'->>\'min\''), 'INTEGER')), 'minFees']],
      raw: true,
    });
    const maxFeesData = await Coaching.findAll({
      attributes: [[sequelize.fn('MAX', sequelize.cast(sequelize.literal('data->\'fees\'->>\'max\''), 'INTEGER')), 'maxFees']],
      raw: true,
    });
    const minPrice = minFeesData[0].minFees;
    const maxPrice = maxFeesData[0].maxFees;

    // Construct the response object
    const filterObject = {
      locations,
      courses: coursesList,
      minPrice,
      maxPrice,
    };

    res.status(200).json({ message: "Filter data retrieved successfully", filterObject });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving filter data", error: error.message });
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
  getFilterData,
  getCoachingById,
  updateCoaching,
  deleteCoaching,
};
