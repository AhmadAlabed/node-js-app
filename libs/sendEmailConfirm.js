const sendEmail = require("../services/sendEmail");
const jwt = require("jsonwebtoken");
const sendEmailConfirm = async (req, id, email, status) => {
  try {
    //---------------------------------------------
    const token = jwt.sign({ id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });
    //---------------------------------------------
    const URL = `${req.protocol}://${req.headers.host}/api/v1/authentication/emailConfirm/${token}`;
    //---------------------------------------------
    const URL2 = `${req.protocol}://${req.headers.host}/api/v1/authentication/resendToken/${id}`;
    //---------------------------------------------
    const message = `Have you recently given this e-mail address when ${status} an account? We want to 
      make sure that this e-mail address is correct and belongs to you. Click this link to 
      confirm: <a href='${URL}'>click here</a> <br> 
      If the link does not work, please click this link :
      <a href='${URL2}'>refresh</a> `;
    //---------------------------------------------
    const subject = "Confirm e-mail address";
    //---------------------------------------------
    await sendEmail(email, message, subject);
    //---------------------------------------------
  } catch (error) {
    return error;
  }
};
module.exports = sendEmailConfirm;
