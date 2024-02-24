const { Loan, createLoan } = require("../models/loan");
const { Op } = require("sequelize"); // Import Sequelize's Op

// Create a loan
const create = async (req, res) => {
  try {
    const loan = await createLoan(req.body);
    res.status(201).json({ message: "Loan created successfully", loan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating loan", error: error.message });
  }
};

// Get all loans
const getAllLoans = async (req, res) => {
  try {
    let { page, show,search } = req.query;
    let { minRate, maxRate, minLoan, maxLoan } = req.body;
    let filters = {
      where: {
        data: {},
      },
    };
    if(search){
      filters.where.data.name ={
        [Op.like]: `%${search}%` 
      }
    }
    if (minLoan) {
      filters.where.data.amount = {
        [Op.gt]: minLoan,
      };
    }
    if (maxLoan) {
      if (filters.where.data.amount) {
        filters.where.data.amount[Op.lt] = maxLoan;
      } else {
        filters.where.data.amount = {
          [Op.lt]: maxLoan,
        };
      }
    }
    if (minRate) {
      filters.where.data.interestRates = {
        male: {
          [Op.gt]: minRate,
        },
      };
    }
    if (maxRate) {
      if (filters.where.data.interestRates?.male) {
        filters.where.data.interestRates.male[Op.lt] = maxRate;
      } else {
        filters.where.data.interestRates = {
          male: {
            [Op.lt]: maxRate,
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
    let loans;
    if (page && show) {
      loans = await Loan.findAll({
        ...filters,
        offset: (page - 1) * show,
        limit: show,
      });
    } else {
      loans = await Loan.findAll();
    }
    const totalCount = await Loan.count();

    res.status(200).json({
      message: "All loans retrieved successfully",
      loans,
      currentPage: page,
      totalPage: Math.ceil(totalCount / show),
      totalCount: totalCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving loans", error: error.message });
  }
};

// Get a loan by ID
const getLoanById = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json({ message: "Loan retrieved successfully", loan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving loan", error: error.message });
  }
};

// Update a loan by ID
const updateLoan = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    await loan.update({ data: req.body });

    res.status(200).json({ message: "Loan updated successfully", loan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating loan", error: error.message });
  }
};

// Delete a loan by ID
const deleteLoan = async (req, res) => {
  const { id } = req.params;

  try {
    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    await loan.destroy();

    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting loan", error: error.message });
  }
};

module.exports = {
  create,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
};
