const userModel = require("../../../DB/models/User");
const bcrypt = require("bcryptjs");
const sendEmailConfirm = require("../../../libs/sendEmailConfirm");
const fs = require("fs");
const path = require("path");
const { roles } = require("../../../middlewares/auth");

///////////////////////////---userProfile---///////////////////////////
const userProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("-password -forgotPasswordCode -__v");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---updateProfile---///////////////////////////
const updateProfile = async (req, res) => {
  try {
    const id = req.user._id;
    const { userName, firstName, lastName, email } = req.body;
    //---------------------------------------------
    const oldUserEmail = await userModel.findById(id).select("email");
    //---------------------------------------------
    let updatedUser;
    if (oldUserEmail.email === email) {
      updatedUser = await userModel
        .findByIdAndUpdate(id, { userName, firstName, lastName }, { new: true })
        .select("-password -forgotPasswordCode -__v");
    } else {
      updatedUser = await userModel
        .findByIdAndUpdate(
          id,
          {
            email,
            userName,
            firstName,
            lastName,
            emailConfirm: false,
          },
          { new: true }
        )
        .select("-password -forgotPasswordCode -__v");
      //---------------------------------------------
      sendEmailConfirm(req, id, email, "updating");
      //---------------------------------------------
    }
    if (updatedUser) {
      res
        .status(201)
        .json({ message: "User Info updated successfully", updatedUser });
    } else {
      res.status(404).json({ message: "User ID does not exist" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---deleteAccount---///////////////////////////
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params; // ID User that you want to delete
    const { _id, role } = req.user; // ID current User + Role current User
    const findUser = await userModel.findById(id);
    if (!findUser) {
      res.status(404).json({ message: "User ID does not exist" });
      return;
    }
    if (id == _id || role == roles.Admin) {
      const deleted = await userModel.deleteOne({ _id: id });
      if (deleted.deletedCount) {
        res.status(200).json({ message: "Account deleted successfully" });
      } else {
        res.status(404).json({ message: "User ID does not exist" });
      }
    } else {
      res.status(401).json({
        message: "You are not authorized to delete this account",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---updatePassword---///////////////////////////
const updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userInfo = await userModel.findById(req.user._id);
    if (oldPassword == newPassword) {
      res.status(400).json({
        message: "Your new password cannot be the same as the old password.",
      });
      return;
    }
    const match = await bcrypt.compare(oldPassword, userInfo.password); //true or false
    if (!match) {
      res.status(400).json({
        message: "Your password is incorrect",
      });
      return;
    }
    const hasedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.SALT_ROUND)
    );
    await userModel.findByIdAndUpdate(userInfo._id, {
      password: hasedPassword,
    });
    res.status(200).json({ message: "Done" });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---profilePic---///////////////////////////
const profilePic = async (req, res) => {
  try {
    if (req.imageError) {
      res.json({ message: "imageError" });
      return;
    }
    const id = req.user._id;
    const findUser = await userModel.findById(id);
    findUser.profilePic.forEach((img) => {
      let fullPath = path.join(__dirname, `../../../${img}`);
      fs.unlinkSync(fullPath);
    });
    const newImageURLs = [];
    req.files.forEach((file) => {
      newImageURLs.push(`${req.destinationFile}/${file.filename}`);
    });
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { profilePic: newImageURLs },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "User profile picture uploaded successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---coverPic---///////////////////////////
const coverPic = async (req, res) => {
  try {
    if (req.imageError) {
      res.json({ message: "imageError" });
      return;
    }
    const id = req.user._id;
    const findUser = await userModel.findById(id);
    findUser.coverPic.forEach((img) => {
      let fullPath = path.join(__dirname, `../../../${img}`);
      fs.unlinkSync(fullPath);
    });
    const newImageURLs = [];
    req.files.forEach((file) => {
      newImageURLs.push(`${req.destinationFile}/${file.filename}`);
    });
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { coverPic: newImageURLs },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "User cover picture uploaded successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  userProfile,
  deleteAccount,
  updateProfile,
  updatePassword,
  profilePic,
  coverPic,
};
