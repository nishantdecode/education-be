const { Slot } = require("../models/slot");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    let slots = [];
    console.log('Request body:', req.body);

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
                startTime: { [Op.gte]: startTime },
                endTime: { [Op.lte]: endTime },
              },
              {
                startTime: { [Op.gte]: endTime },
                endTime: { [Op.lte]: endTime },
              },
              {
                startTime: { [Op.lte]: startTime },
                endTime: { [Op.gte]: endTime },
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
      const startDate = new Date(slot.startDate).toISOString();
      const endDate = new Date(slot.endDate).toISOString();
      const startTime = new Date(slot.startTime).toISOString();
      const endTime = new Date(slot.endTime).toISOString();

      promises.push(
        Slot.create({
          startDate: startDate,
          endDate: endDate,
          startTime: startTime,
          endTime: endTime,
          status: "Available",
          slotDuration: slot.slotDuration,
          price: slot.price,
        })
      );
    }

    try {
      await Promise.all(promises);
      console.log('Slots successfully created');
      res.send({ message: "Successfully created" });
    } catch (error) {
      console.log('Error during slot creation:', error);
      res.status(500).send({ error: error.message });
    }

  } catch (error) {
    console.log('Error processing request:', error);
    res.status(500).send({ error: error.message });
  }
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
    // Parse the date and set it to the start of the day in UTC
    const parsedDate = new Date(date);
    const startOfDay = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const slots = await Slot.findAll({
      where: {
        startDate: { 
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay
        }
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
