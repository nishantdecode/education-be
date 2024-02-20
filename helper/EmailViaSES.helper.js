const AWS = require("aws-sdk");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const sendMail = async (email, subject, text) => {
  // create Nodemailer SES transporter
  const ses = new AWS.SES();
  // Send email function
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: text,
        },
      },
      Subject: {
        Data: subject,
      },
    },
    Source: "brihatinfotech.com",
  };

  ses.sendEmail(params, function (err, data) {
    if (err) {
      console.error("Error sending email", err);
    } else {
      console.log("Email sent successfully", data);
    }
  });
};

module.exports.sendMailViaSES = sendMail;
