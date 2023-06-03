const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const returnObject = {};
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: {
      user: "danielgoye92@gmail.com",
      pass: "3ntYqrgBCsjQxTD0",
    },
  });

  const mailOptions = {
    from: `danielgoye92@gmail.com`,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info: info };
  } catch (error) {
    return { success: false, error: error };
  }
};

module.exports = sendMail;
