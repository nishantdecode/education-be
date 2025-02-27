const axios = require("axios");
const btoa = require("btoa");

const getAccessToken = async () => {
  try {
    base_64 = btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET);

    const resp = await axios({
      method: "POST",
      url:
        "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" +
        `${process.env.ACCOUNT_ID}`,
      headers: {
        Authorization: "Basic " + `${base_64} `,
      },
    });

    return resp.data.access_token;
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

const listZoomMeetings = async () => {
  try {
    const resp = await axios({
      method: "get",
      url: "https://api.zoom.us/v2/users/me/meetings",
      headers: {
        Authorization: "Bearer " + `${await getAccessToken()} `,
        "Content-Type": "application/json",
      },
    });
    const meetings = resp.data.meetings;

    const newArray = meetings.map((obj) =>
      ["id", "topic"].reduce((newObj, key) => {
        newObj[key] = obj[key];
        return newObj;
      }, {})
    );

    return newArray;
  } catch (err) {
    if (err.status == undefined) {
      console.log("Error : ", err);
    }
  }
};

const createZoomMeeting = async (type, email, startTime, topic) => {
  try {
    const data = JSON.stringify({
      type: type,
      meeting_invitees: {
        email
      },
      start_time: startTime,
      topic
    });

    const resp = await axios({
      method: "post",
      url: "https://api.zoom.us/v2/users/me/meetings",
      headers: {
        Authorization: "Bearer " + `${await getAccessToken()} `,
        "Content-Type": "application/json",
      },
      data: data,
    });

    return resp.data;
  } catch (err) {
    if (err.status == undefined) {
      console.log("Error : ", err);
    }
  }
};

module.exports = {
  createZoomMeeting,
  listZoomMeetings,
};
