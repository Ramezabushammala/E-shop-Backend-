const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create transporter (services that will send email like "gmail")
  const transporter = nodemailer.createTransport({
     host: process.env.EMAIL_HOST,
     port: process.env.EMAIL_PORT, // if secure false port=587 if true port=465
     secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // Define email option(like from ,to,subject,emailcontent)
  const mailOptions = {
    from: "E-shop App <ramezabushammala@gmail.com>", // email send code for all users in system
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // // send email
   await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
