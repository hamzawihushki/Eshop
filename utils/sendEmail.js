// emailService.js
const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure you load environment variables

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOpts = {
    from: "hushkihamza9@gmail.com",
    to: options.to,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOpts);
};

module.exports = { sendEmail };
