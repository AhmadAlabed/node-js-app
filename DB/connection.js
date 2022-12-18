const mongoose = require("mongoose");
const connectDB = () => {
  return mongoose
    .connect(process.env.CONNECTION_STRING)
    .then((result) =>
      console.log(
        "--------------------------connected--------------------------"
      )
    )
    .catch((err) =>
      console.log(
        "--------------------------Error--------------------------",
        err
      )
    );
};
module.exports = connectDB;
