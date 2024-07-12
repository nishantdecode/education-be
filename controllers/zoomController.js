const { listZoomMeetings } = require("../api/zoomAPI.js");
const { Meeting } = require("../models/meeting");
const { User } = require("../models/user");
const { Op } = require("sequelize");

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
  listMeeting,
  getMeeting,
  latestMeeting,
  updateMeeting,
  deleteMeeting,
};
