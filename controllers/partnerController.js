const { Partner, createPartner } = require("../models/partner");

const createAdd = async (req, res) => {
  const { title, sources, url } = req.body;

  try {
    const partner = await createPartner({ title, sources, url });
    res.status(201).json({ message: "Partner created successfully", partner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating partner", error: error.message });
  }
};

const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll();
    res
      .status(200)
      .json({ message: "All partners retrieved successfully", partners });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error retrieving partners", error: error.message });
  }
};

const getPartnerById = async (req, res) => {
  const { id } = req.params;

  try {
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }
    res
      .status(200)
      .json({ message: "Partner retrieved successfully", partner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving partner", error: error.message });
  }
};

const updatePartner = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, link, type } = req.body;

  try {
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    partner.title = title;
    partner.description = description;
    partner.imageUrl = imageUrl;
    partner.link = link;
    partner.type = type;

    await partner.save();

    res.status(200).json({ message: "Partner updated successfully", partner });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating partner", error: error.message });
  }
};

const deletePartner = async (req, res) => {
  const { id } = req.params;

  try {
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    await partner.destroy();

    res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting partner", error: error.message });
  }
};

module.exports = {
  createAdd,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
};
