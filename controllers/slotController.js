const { Slot } = require("../models/slot");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    let slots = [];

    if (req.body.slots) {
      slots = [...req.body.slots];
    } else {
      return res.status(400).send({ error: "No slots provided" });
    }

    const checkers = [];
    for (let slot of slots) {
      const startTime = new Date(slot.startTime).toISOString();
      const endTime = new Date(slot.endTime).toISOString();

      checkers.push(
        Slot.findOne({
          where: {
            [Op.or]: [
              {
                startTime: { [Op.between]: [startTime, endTime] },
              },
              {
                endTime: { [Op.between]: [startTime, endTime] },
              },
              {
                [Op.and]: [
                  { startTime: { [Op.lte]: startTime } },
                  { endTime: { [Op.gte]: endTime } },
                ],
              },
            ],
          },
        })
      );
    }

    const checkResults = await Promise.all(checkers);
    for (let check of checkResults) {
      if (check) {
        return res.status(400).send({
          error: `Slot already created in this time range!`,
        });
      }
    }

    const promises = [];
    for (let slot of slots) {
      const startTime = new Date(slot.startTime).toISOString();
      const endTime = new Date(slot.endTime).toISOString();

      promises.push(
        Slot.create({
          startTime: startTime,
          endTime: endTime,
          status: "Available",
          slotDuration: slot.slotDuration,
          price: slot.price,
        })
      );
    }

    try {
      const slots = await Promise.all(promises);
      res.send({ message: "Successfully created" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.findAll();
    res.status(200).json({
      message: "All slots retrieved successfully",
      slots,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving slots", error: error.message });
  }
};

const getSlot = async (req, res) => {
  const { slotId } = req.params;
  try {
    const slot = await Slot.findByPk(slotId);
    res.status(200).json({
      message: "Slot retrieved successfully",
      slot,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving slot", error: error.message });
  }
};

const getAllSlotsByDate = async (req, res) => {
  const { startDate, endDate } = req.body;

  console.log("Test---------------------------------------------")
  console.log(startDate, endDate)
  try {
    const slots = await Slot.findAll({
      where: {
        startTime: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    console.log(slots)
    if (!slots || slots.length === 0) {
      return res.status(404).json({ message: "Slots not found" });
    }

    res.status(200).json({ message: "Slots retrieved successfully", slots });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving slots", error: error.message });
  }
};

const updateSlot = async (req, res) => {
  const { id } = req.body;
  const { userId, status } = req.body;

  try {
    const slot = await Slot.findByPk(id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    slot.bookingUserId = userId;
    slot.status = status;

    await slot.save();

    res.status(200).json({ message: "Slot updated successfully", slot });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Slot", error: error.message });
  }
};

const deleteSlot = async (req, res) => {
  const { id } = req.query;

  try {
    const slot = await Slot.findByPk(id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    await slot.destroy();

    res.status(200).json({ message: "Slot deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting testimonial", error: error.message });
  }
};

module.exports = {
  create,
  getSlot,
  getAllSlots,
  getAllSlotsByDate,
  updateSlot,
  deleteSlot,
};
