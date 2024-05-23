const { createZoomMeeting, listZoomMeetings } = require("../api/zoomAPI.js");
const { Meeting } = require("../models/meeting");
const { User } = require("../models/user");
const { Op } = require("sequelize");

const CreateAppointment = async (req, res) => {
  const { type, userId, email, date, startTime, endTime, topic, slotId } =
    req.body;

  try {
    if (!type) {
      res.status(400);
      throw new Error("Please Fill all the fields");
    } else {
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
          date,
          startTime,
          endTime,
          hostLink: zoomMeeting.start_url,
          attendeeLink: zoomMeeting.join_url,
        });
      }

      res.status(201).json(zoomMeeting);
    }
  } catch (error) {
    console.error("Error creating meeting:", error);
    res
      .status(500)
      .json({ message: "Error creating meeting", error: error.message });
  }
};

const ListMeeting = async (req, res) => {
  try {
    const meetings = await listZoomMeetings();
    if (meetings === undefined) {
      res.status(400);
      throw new Error("No meeting found");
    } else {
      res.status(201).json({ meetings });
    }
  } catch (error) {
    console.error("Error listing meeting:", error);
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
    } else if(startDate) {
      const date = new Date(startDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      meeting = await Meeting.findAll({
        where: {
          startTime: {
            [Op.gte]: startOfDay,
            [Op.lt]: endOfDay,
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

    console.log(meeting);

    if (!meeting) {
      return res.status(404).json({ message: "No meeting found" });
    }

    return res.status(200).json(meeting);
  } catch (error) {
    console.error("Error listing meeting:", error);
    res
      .status(500)
      .json({ message: "Error listing meeting", error: error.message });
  }
};

const latestMeeting = async (req, res) => {
  const { userId } = req.query;
  console.log(userId)

  try {
    let meeting = await Meeting.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });

    if (!meeting) {
      return res.status(404).json({ message: "No meeting found" });
    }

    return res.status(200).json(meeting);
  } catch (error) {
    console.error("Error listing meeting:", error);
    res
      .status(500)
      .json({ message: "Error listing meeting", error: error.message });
  }
};

module.exports = {
  CreateAppointment,
  ListMeeting,
  getMeeting,
  latestMeeting
};
