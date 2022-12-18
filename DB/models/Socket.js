const mongoose = require("mongoose");
const socketSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    socketID: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const socketModel = mongoose.model("Socket", socketSchema);

module.exports = socketModel;
