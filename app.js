const express = require("express");
require("dotenv").config();
const schedule = require("node-schedule");
const path = require("path");
const cors = require("cors");
//////////////////////////////////////////
const connectDB = require("./DB/connection");
const { runAllProductsToday } = require("./libs/allProductsToday");
const indexRouter = require("./modules/index.router");
const userConnected = require("./libs/userConnected");
const userDisconnected = require("./libs/userDisconnected");
const { initIO } = require("./services/socket");
//////////////////////////////////////////
const app = express();
const PORT = process.env.PORT;
//////////////////////////////////////////
connectDB();
//////////////////////////////////////////
schedule.scheduleJob("59 59 23 * * *", function () {
  runAllProductsToday();
});
//////////////////////////////////////////
app.use(cors());
app.use(express.json());
app.use("/api/v1/authentication", indexRouter.authenticationRouter);
app.use("/api/v1/user", indexRouter.userRouter);
app.use("/api/v1/admin", indexRouter.adminRouter);
app.use("/api/v1/product", indexRouter.productRouter);
app.use("/api/v1/comment", indexRouter.commentRouter);
//////////////////////////////////////////
app.use(
  "/uploads/ProfilePic",
  express.static(path.join(__dirname, "./uploads/ProfilePic"))
);
app.use(
  "/uploads/CoverPic",
  express.static(path.join(__dirname, "./uploads/CoverPic"))
);
//////////////////////////////////////////
app.use(function (err, req, res, next) {
  if (err.code === "LIMIT_FILE_SIZE") {
    res.send({
      result: "fail",
      error: { code: 1001, message: "File is too big" },
    });
    return;
  }
  if (err) {
    res.status(400).json(err);
  } else {
    next();
  }
});
////////////------ 404 ------////////////
app.all("*", (req, res) => {
  res.json({ message: "404 Route Not Found" });
});

//////////////////////////////////////////
const server = app.listen(PORT, () => {
  console.log(
    `................Server Running on PORT ${PORT}..................`
  );
});
/////////////////////////////SOCKET_IO
const io = initIO(server);
io.on("connection", (socket) => {
  socket.on("userConnected", (data) => {
    userConnected(data, socket.id);
  });
  socket.on("disconnect", function () {
    userDisconnected(socket.id);
  });
});
/////////////////////////////SOCKET_IO
