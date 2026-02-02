const nodeMailer = require("nodemailer");

const process = async (receiver, subject, html) => {
  try {
    const transporter = nodeMailer.createTransport({
      port: process.env.EMAIL_PORT,
      host: process.env.EMAIL_HOST,
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
      },
    });

    const transport = await transporter.sendMail({
      from: "Scholar Press" + process.env.SENDER_EMAIL,
      to: receiver,
      subject: subject,
      html: html,
    });

    return true;
  } catch (error) {
    throw error;
  }
};

const sendMail = async (receiver, subject, html) => {
  return await process(receiver, subject,html);
};

module.exports = sendMail;
