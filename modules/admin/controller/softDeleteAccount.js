const userModel = require("../../../DB/models/User");
const sendEmail = require("../../../services/sendEmail");
const softDeleteAccount = async (req, res) => {
  try {
    const id = req.user._id; //Admin
    const deleteAccountID = req.params.id; //User
    const deletedAccount = await userModel.findByIdAndUpdate(
      deleteAccountID,
      { isDeleted: true },
      { new: true }
    );
    if (deletedAccount) {
      const message = "The admin has deleted your account.";
      const subject = "Your account has been deleted!";
      await sendEmail(deletedAccount.email, message, subject);
      res.status(200).json({
        message: "This Account deleted successfully",
      });
    } else {
      res.status(404).json({ message: "User ID does not exist" });
    }
  } catch (error) {
    res.json(error);
  }
};
module.exports = softDeleteAccount;
