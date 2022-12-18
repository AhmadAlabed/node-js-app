const userModel = require("../../../DB/models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../../../services/sendEmail");
const path = require("path");
const sendEmailConfirm = require("../../../libs/sendEmailConfirm");
///////////////////////////---signup---///////////////////////////
const signup = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const newUser = new userModel({ userName, email, password });
    const savedUser = await newUser.save();
    //---------------------------------------------
    sendEmailConfirm(req, savedUser._id, savedUser.email, "creating");
    //---------------------------------------------
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.keyValue?.email) {
      res.status(409).json({ message: "Email already exists.", error });
    } else {
      res.status(500).json(error);
    }
  }
};
///////////////////////////---emailConfirm---///////////////////////////
const emailConfirm = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (!token || token == undefined || token.length == 0 || token == null) {
      res.status(401).json({ message: "Invalid Token" });
    } else {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      if (!decoded) {
        res.status(400).json({ message: "Invalid decoded Token" });
      } else {
        const findUser = await userModel
          .findById(decoded.id)
          .select("emailConfirm");
        if (!findUser) {
          res.status(404).json({ message: "Invalid Account" });
        } else {
          if (findUser.emailConfirm) {
            res.status(400).json({ message: "Email already confirmed" });
          } else {
            const updateUser = await userModel.findOneAndUpdate(
              { _id: findUser._id },
              { emailConfirm: true },
              { new: true }
            );
            res.render(path.join(__dirname + "./../../../views/welcome.pug"), {
              userName: updateUser.userName,
              email: updateUser.email,
            });
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---resendToken---///////////////////////////
const resendToken = async (req, res, next) => {
  try {
    const id = req.params.id;
    const findUser = await userModel.findById(id);
    if (!findUser) {
      res.status(404).json({ message: "Invalid Account" });
    } else {
      if (findUser.emailConfirm) {
        res.status(400).json({ message: "Email already confirmed" });
      } else {
        //---------------------------------------------
        sendEmailConfirm(req, findUser._id, findUser.email, "creating");
        //---------------------------------------------
        res
          .status(201)
          .json({ message: "please check your email to verify your account" });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---signin---///////////////////////////
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userInfo = await userModel.findOne({ email });
    if (userInfo) {
      ////////////////STATUS OF User////////////////
      if (userInfo.emailConfirm === false) {
        res.status(401).json({
          message: "Please confirm your email address",
        });
        return;
      }
      if (userInfo.isBlocked === true) {
        res.status(401).json({
          message: "This user has been blocked",
        });
        return;
      }
      if (userInfo.isDeleted === true) {
        res.status(401).json({
          message: "This user has been deleted",
        });
        return;
      }
      ////////////////STATUS OF User////////////////
      const match = await bcrypt.compare(password, userInfo.password); //true or false
      if (match) {
        //---------------------------------------------jwt
        const token = jwt.sign(
          { id: userInfo._id, isLoggedIn: true },
          process.env.TOKEN_KEY,
          { expiresIn: "24h" }
        );
        //---------------------------------------------jwt
        res.status(200).json({ message: "Logged in successfully", token });
      } else {
        res
          .status(401)
          .json({ message: "The username or password is incorrect" });
      }
    } else {
      res.status(404).json({ message: "The username is incorrect" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---sendCode---///////////////////////////
const sendCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      res.status(404).json({ message: "The username is incorrect" });
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000);
    message = `<p> Reset Password Code : ${code} </p>`;
    subject = "Reset Password";
    await userModel.findByIdAndUpdate(userInfo._id, {
      forgotPasswordCode: code,
    });
    await sendEmail(email, message, subject);
    res.status(200).json({ message: "Done" });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---forgotPassword---///////////////////////////
const forgotPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    const userInfo = await userModel.findOne({ email });
    if (!userInfo) {
      res.status(404).json({ message: "The username is incorrect" });
      return;
    }
    if (userInfo.forgotPasswordCode !== code) {
      res.status(404).json({ message: "wrong code" });
      return;
    }
    const hasedPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.SALT_ROUND)
    );
    await userModel.findByIdAndUpdate(userInfo._id, {
      password: hasedPassword,
      forgotPasswordCode: "",
    });
    res.status(200).json({ message: "Done" });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---End---///////////////////////////
module.exports = {
  signup,
  emailConfirm,
  resendToken,
  signin,
  sendCode,
  forgotPassword,
};
