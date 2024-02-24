const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Create a loan
router.post('/', loanController.create);

// Get all loans
router.post('/', loanController.getAllLoans);

// Get a loan by ID
router.get('/:id', loanController.getLoanById);

// Update a loan by ID
router.put('/:id', loanController.updateLoan);

// Delete a loan by ID
router.delete('/delete/:id', loanController.deleteLoan);

module.exports = router;
