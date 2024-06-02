const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: true,
  auth: {
    user: process?.env?.EMAIL_USER,
    pass: process?.env?.EMAIL_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

// Function to send email
const sendEmail = (to, subject, text) => {
  let mailOptions = {
    from: process?.env?.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info.response);
    });
  });
};

module.exports = {
  sendEmail,
};
