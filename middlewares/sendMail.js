const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
require('dotenv').config();

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async (email, subject, htmlContent) => {

    const sender = {
        email: "manish@brihatinfotech.com",
        name: "Edmertion Support Team"
    };
    const receivers = [
        {
            email: email
        }
    ];

    try {
        const sendMailToEmail = await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject,
            textContent: "test Email",
            htmlContent
        })
        console.log("Email Sent Successfully");
        return sendMailToEmail;
    } catch (err) {
        console.log(err);
    }

}

module.exports = sendEmail
