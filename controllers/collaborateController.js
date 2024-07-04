const { sendMail } = require("../helper/EmailViaBrevo.helper");
const { createCollaboration } = require("../models/collaborate");

const collaborate = async (req, res) => {
  const { name, companyname, email, phone } = req.body;

  try {
    const collaborate = await createCollaboration({
      name,
      companyname,
      email,
      phone,
    });
    sendMail(
      email,
      "Collaboration Request",
      "Dear User, Your request for collaboration with Edmertion has been submitted successfully."
    );
    res
      .status(201)
      .json({ message: "Form Submitted Successfully", collaborate });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting form", error: error.message });
  }
};

module.exports = {
  collaborate,
};
