const { Slot } = require("../models/slot");
const { Op } = require("sequelize");

const create = async (req, res) => {
  let slots = [];
  console.log(req.body);
  if (req.body.slots) {
    slots = [...req.body.slots];
  }
  const checkers = [];
  for (let slot of slots) {
    checkers.push(
      Slot.findOne({
        where: {
          [Op.or]: [
            {
              startTime: { [Op.gte]: new Date(slot.startTime) },
              endTime: { [Op.lte]: new Date(slot.endTime) },
            },
            {
              startTime: { [Op.gte]: new Date(slot.endTime) },
              endTime: { [Op.lte]: new Date(slot.endTime) },
            },
            {
              startTime: { [Op.lte]: new Date(slot.startTime) },
              endTime: { [Op.gte]: new Date(slot.endTime) },
            },
          ],
        },
      })
    );
  }
  const checkResults = await Promise.all(checkers);
  for await (let check of checkResults) {
    if (check) {
      return res.status(400).send({
        error: `Slot already created in this time range!`,
      });
    }
  }

  const promises = [];
  for (let slot of slots) {
    const appointment = await Slot.create({
      startDate: new Date(slot.startDate),
      endDate: new Date(slot.endDate),
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
      status: "Available",
      slotDuration: slot.slotDuration,
      price: slot.price,
    });
    promises.push(appointment);
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ error: error.message });
  }

  res.send({ message: "Successfully created" });
};

const getAllSlots = async (req, res) => {
  try {
    const slot = await Slot.findAll();
    res.status(200).json({
      message: "All slots retrieved successfully",
      slot,
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
    console.log(slot)
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
  const { date } = req.body;

  try {
    const parsedDate = new Date(date);

    const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));

    const slots = await Slot.findAll({
      where: {
        startDate: { [Op.gte]: startOfDay },
        endDate: { [Op.lte]: endOfDay },
      },
    });

    console.log(slots);

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
