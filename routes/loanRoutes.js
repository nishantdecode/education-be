const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");

router.post("/", loanController.create);
router.post("/all", loanController.getAllLoans);
router.get("/:id", loanController.getLoanById);
router.put("/:id", loanController.updateLoan);
router.delete("/delete/:id", loanController.deleteLoan);

module.exports = router;
