const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Loan = sequelize.define(
  "Loan",
  {
    data: {
      type: DataTypes.JSONB, // Use JSONB data type for flexible JSON storage
      allowNull: false,
    },
  },
  {
    tableName: "Loans",
  }
);

const createLoan = async (addData) => {
  try {
    const loan = await Loan.create({ data: addData });
    return loan;
  } catch (error) {
    console.error("Validation error details:", error);
    throw new Error(error.message);
  }
};

module.exports = {
  Loan,
  createLoan,
};
