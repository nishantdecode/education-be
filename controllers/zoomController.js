const { createZoomMeeting, listZoomMeetings } = require("../api/zoomAPI.js");
const { Meeting } = require("../models/meeting");
const { Slot } = require("../models/slot.js");
const { User } = require("../models/user");
const { Op } = require("sequelize");

const createAppointment = async (req, res) => {
  const { type, userId, email, startTime, endTime, topic, slotId } = req.body;

  try {
    if (
      !type ||
      !userId ||
      !email ||
      !startTime ||
      !endTime ||
      !topic ||
      !slotId
    ) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }

    const slotFetched = await Slot.findByPk(slotId);

    if (slotFetched.status === "Available") {
      const zoomMeeting = await createZoomMeeting(
        type,
        email,
        startTime,
        topic
      );

      if (zoomMeeting) {
        await Meeting.create({
          topic,
          slotId,
          userId,
          startTime,
          endTime,
          hostLink: zoomMeeting.start_url,
          attendeeLink: zoomMeeting.join_url,
          status: "Join",
        });

        const slot = await Slot.findOne({
          where: { id: order.slotId },
        });

        slot.status = "Booked";
        slot.bookingUserId = order.userId;

        await slot.save();

        res.status(201).json(zoomMeeting);
        return;
      } else {
        throw new Error("Zoom meeting creation failed");
      }
    } else {
      res.status(400).json({ message: "Slot already booked" });
      return;
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    res
      .status(500)
      .json({ message: "Error creating meeting", error: error.message });
  }
};

const listMeeting = async (req, res) => {
  try {
    const meetings = await listZoomMeetings();
    if (meetings === undefined) {
      res.status(400);
      throw new Error("No meeting found");
    } else {
      res.status(201).json({ meetings });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing meeting", error: error.message });
  }
};

const getMeeting = async (req, res) => {
  const { startDate } = req.query;
  let { slotId, userId } = req.query; // Assuming slotId and userId are passed as query parameters

  try {
    let meeting;

    slotId = slotId === "null" ? null : slotId;
    userId = userId === "null" ? null : userId;

    if (slotId) {
      meeting = await Meeting.findOne({
        where: { slotId },
      });
    } else if (userId) {
      meeting = await Meeting.findOne({
        where: { userId },
      });
    } else if (startDate) {
      const date = new Date(startDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      meeting = await Meeting.findAll({
        where: {
          startTime: {
            [Op.gte]: startOfDay,
            [Op.lt]: endOfDay,
          },
          status: {
            [Op.ne]: "Expired",
          },
        },
        include: [
          {
            model: User,
            attributes: [
              "userId",
              "firstName",
              "email",
              "mobile",
              "lastName",
              "profileImageUrl",
            ],
          },
        ],
        order: [["startTime", "ASC"]],
      });
    }

    if (!meeting) {
      return res.status(404).json({ message: "No meeting found" });
    }

    return res.status(200).json(meeting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing meeting", error: error.message });
  }
};

const latestMeeting = async (req, res) => {
  const { userId } = req.query;
  const { startDate } = req.body;
  const currentDateStart = new Date(startDate).toISOString();

  try {
    let meeting = await Meeting.findOne({
      where: {
        userId,
        startTime: {
          [Op.gte]: [currentDateStart],
        },
        status: {
          [Op.ne]: "Expired",
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (!meeting) {
      return res.status(404).json({ message: "No meeting found for today" });
    }

    return res.status(200).json(meeting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error listing meeting", error: error.message });
  }
};

const updateMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.status = "Joined";

    await meeting.save();

    res.status(200).json({ message: "Meeting updated successfully", meeting });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating meeting", error: error.message });
  }
};

const deleteMeeting = async (req, res) => {
  const { id } = req.params;

  try {
    const meeting = await Meeting.findByPk(id);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.status = "Expired";

    await meeting.save();

    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting meeting", error: error.message });
  }
};

module.exports = {
  createAppointment,
  listMeeting,
  getMeeting,
  latestMeeting,
  updateMeeting,
  deleteMeeting,
};
