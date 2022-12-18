const nodemailer = require("nodemailer");

async function sendEmail(dest, message, subject, filename = "", path = "") {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
    });
    let mailOptions;
    if (filename === "" || path === "") {
      mailOptions = {
        from: `"noreply" <${process.env.SENDER_EMAIL}>`,
        to: dest,
        subject: subject,
        text: "",
        html: message,
      };
    } else {
      mailOptions = {
        from: `"noreply" <${process.env.SENDER_EMAIL}>`,
        to: dest,
        subject: subject,
        text: "",
        html: message,
        attachments: [
          {
            filename,
            path,
          },
        ],
      };
    }

    let info = await transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
}
module.exports = sendEmail;
