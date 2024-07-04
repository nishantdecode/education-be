const { Social } = require("../models/social");
const { createSocial } = require("../models/social");

const createAdd = async (req, res) => {
  const socialData = req.body;
  try {
    const createdSocials = await Promise.all(
      socialData.map(async (data) => {
        let social;
        const { platform, link } = data;
        const socialExists = await Social.findOne({
          where: { platform },
        });
        if (!socialExists) {
          social = await createSocial({ platform, link });
        } else {
          social = await Social.findByPk(socialExists.id);
          if (!social) {
            return res.status(404).json({ message: "Social not found" });
          }
          social.platform = platform;
          social.link = link;
          await social.save();
        }
        return social;
      })
    );
    res.status(201).json({
      message: "Socials created successfully",
      socials: createdSocials,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating socials", error: error.message });
  }
};

const getAllSocials = async (req, res) => {
  try {
    const socials = await Social.findAll();
    res
      .status(200)
      .json({ message: "All socials retrieved successfully", socials });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving socials", error: error.message });
  }
};

const getSocialById = async (req, res) => {
  const { id } = req.params;

  try {
    const social = await Social.findByPk(id);
    if (!social) {
      return res.status(404).json({ message: "Social not found" });
    }
    res.status(200).json({ message: "Social retrieved successfully", social });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving social", error: error.message });
  }
};

const updateSocial = async (req, res) => {
  const { id } = req.params;
  const { platform, link } = req.body;

  try {
    const social = await Social.findByPk(id);
    if (!social) {
      return res.status(404).json({ message: "Social not found" });
    }

    social.platform = platform;
    social.link = link;

    await social.save();

    res.status(200).json({ message: "Social updated successfully", social });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating social", error: error.message });
  }
};

const deleteSocial = async (req, res) => {
  const { id } = req.params;

  try {
    const social = await Social.findByPk(id);
    if (!social) {
      return res.status(404).json({ message: "Social not found" });
    }

    await social.destroy();

    res.status(200).json({ message: "Social deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting social", error: error.message });
  }
};

module.exports = {
  createAdd,
  getAllSocials,
  getSocialById,
  updateSocial,
  deleteSocial,
};
