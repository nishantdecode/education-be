const { Offer } = require("../models/offer");
const { createOffer } = require("../models/offer");

const createAdd = async (req, res) => {
  const { title, description, imageUrl } = req.body;
  console.log(imageUrl);

  try {
    const offer = await createOffer({ title, description, imageUrl });

    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (error) {
    console.error("Error in createAdd:", error); // Log the complete error
    res.status(500).json({
      message: "Error creating offer",
      error: error.message, // Send detailed error message
      stack: error.stack, // Optionally include the stack trace
    });
  }
};

const getAllOffers = async (req, res) => {
  try {
    const { title } = req.query;
    let offers;
    if (title) {
      offers = await Offer.findAll();
    } else {
      offers = await Offer.findAll({
        where: {
          title,
        },
      });
    }
    res.status(200).json({ message: "Offers retrieved successfully", offers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving offers", error: error.message });
  }
};

const getOfferById = async (req, res) => {
  const { id } = req.params;

  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }
    res.status(200).json({ message: "Offer retrieved successfully", offer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving offer", error: error.message });
  }
};

const updateOffer = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl } = req.body;

  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    offer.title = title;
    offer.description = description;
    offer.imageUrl = imageUrl;

    await offer.save();

    res.status(200).json({ message: "Offer updated successfully", offer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating offer", error: error.message });
  }
};

const deleteOffer = async (req, res) => {
  const { id } = req.params;

  try {
    const offer = await Offer.findByPk(id);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    await offer.destroy();

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting offer", error: error.message });
  }
};

module.exports = {
  createAdd,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};
