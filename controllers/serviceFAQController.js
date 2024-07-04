const { ServiceFAQ, createServiceFAQ } = require("../models/serviceFAQ");

// Create a new ServiceFAQ
const create = async (req, res) => {
  try {
    const serviceFAQ = await createServiceFAQ(req.body);
    res
      .status(201)
      .json({ message: "ServiceFAQ created successfully", serviceFAQ });
  } catch (error) {
    console.error("Error creating serviceFAQ:", error);
    res
      .status(500)
      .json({ message: "Error creating serviceFAQ", error: error.message });
  }
};

// Get all ServiceFAQs
const getAllServiceFAQs = async (req, res) => {
  try {
    const serviceFAQs = await ServiceFAQ.findAll();
    res
      .status(200)
      .json({ message: "All serviceFAQs retrieved successfully", serviceFAQs });
  } catch (error) {
    console.error("Error retrieving serviceFAQs:", error);
    res
      .status(500)
      .json({ message: "Error retrieving serviceFAQs", error: error.message });
  }
};

// Get all ServiceFAQs by type
const getAllServiceFAQsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const serviceFAQs = await ServiceFAQ.findAll({ where: { type } });
    res
      .status(200)
      .json({
        message: `All ${type} feature ads retrieved successfully`,
        serviceFAQs,
      });
  } catch (error) {
    console.error("Error retrieving feature ads:", error);
    res
      .status(500)
      .json({ message: "Error retrieving feature ads", error: error.message });
  }
};

// Get a ServiceFAQ by ID
const getServiceFAQById = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceFAQ = await ServiceFAQ.findByPk(id);
    if (!serviceFAQ) {
      return res.status(404).json({ message: "ServiceFAQ not found" });
    }
    res
      .status(200)
      .json({ message: "ServiceFAQ retrieved successfully", serviceFAQ });
  } catch (error) {
    console.error("Error retrieving serviceFAQ:", error);
    res
      .status(500)
      .json({ message: "Error retrieving serviceFAQ", error: error.message });
  }
};

// Update a ServiceFAQ
const updateServiceFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceFAQ = await ServiceFAQ.findByPk(id);
    if (!serviceFAQ) {
      return res.status(404).json({ message: "ServiceFAQ not found" });
    }
    await serviceFAQ.update(req.body);
    res
      .status(200)
      .json({ message: "ServiceFAQ updated successfully", serviceFAQ });
  } catch (error) {
    console.error("Error updating serviceFAQ:", error);
    res
      .status(500)
      .json({ message: "Error updating serviceFAQ", error: error.message });
  }
};

// Delete a ServiceFAQ
const deleteServiceFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceFAQ = await ServiceFAQ.findByPk(id);
    if (!serviceFAQ) {
      return res.status(404).json({ message: "ServiceFAQ not found" });
    }
    await serviceFAQ.destroy();
    res.status(200).json({ message: "ServiceFAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting serviceFAQ:", error);
    res
      .status(500)
      .json({ message: "Error deleting serviceFAQ", error: error.message });
  }
};

module.exports = {
  create,
  getAllServiceFAQs,
  getServiceFAQById,
  updateServiceFAQ,
  deleteServiceFAQ,
  getAllServiceFAQsByType,
};
