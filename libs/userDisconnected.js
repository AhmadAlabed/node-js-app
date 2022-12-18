const socketModel = require("../DB/models/Socket");

const userDisconnected = async (socketID) => {
  try {
    await socketModel.findOneAndDelete({ socketID });
  } catch (error) {
    return error;
  }
};
module.exports = userDisconnected;
