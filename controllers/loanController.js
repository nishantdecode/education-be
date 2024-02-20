const { Loan, createLoan } = require('../models/loan');

// Create a loan
const create = async (req, res) => {
    try {
        const loan = await createLoan(req.body);
        res.status(201).json({ message: 'Loan created successfully', loan });
    } catch (error) {
        res.status(500).json({ message: 'Error creating loan', error: error.message });
    }
};

// Get all loans
const getAllLoans = async (req, res) => {
    try {
        let { page, show } = req.query;
    if (page) {
      page = parseInt(page);
    }
    if (show) {
      show = parseInt(show);
    }
    let loans;
    if (page && show) {
        loans = await Loan.findAll({
            offset: page * show,
            limit: show,
        });
    } else {
        loans = await Loan.findAll();
    }
        res.status(200).json({ message: 'All loans retrieved successfully', loans });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving loans', error: error.message });
    }
};

// Get a loan by ID
const getLoanById = async (req, res) => {
    const { id } = req.params;

    try {
        const loan = await Loan.findByPk(id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json({ message: 'Loan retrieved successfully', loan });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving loan', error: error.message });
    }
};

// Update a loan by ID
const updateLoan = async (req, res) => {
    const { id } = req.params;

    try {
        const loan = await Loan.findByPk(id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        await loan.update({ data: req.body });

        res.status(200).json({ message: 'Loan updated successfully', loan });
    } catch (error) {
        res.status(500).json({ message: 'Error updating loan', error: error.message });
    }
};

// Delete a loan by ID
const deleteLoan = async (req, res) => {
    const { id } = req.params;

    try {
        const loan = await Loan.findByPk(id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        await loan.destroy();

        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting loan', error: error.message });
    }
};

module.exports = {
    create,
    getAllLoans,
    getLoanById,
    updateLoan,
    deleteLoan,
};
