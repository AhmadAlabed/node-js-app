const socketModel = require("../DB/models/Socket");

const userConnected = async (userID, socketID) => {
  try {
    const newSocket = new socketModel({ userID, socketID });
    await newSocket.save();
  } catch (error) {
    return error;
  }
};
module.exports = userConnected;
