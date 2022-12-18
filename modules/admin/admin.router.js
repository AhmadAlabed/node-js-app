const router = require("express").Router();
///////////////////////////////////////////////////////
const { auth } = require("../../middlewares/auth");
const endPoint = require("./admin.endPoint");
const softDeleteAccount = require("./controller/softDeleteAccount");
const validation = require("../../middlewares/validation");
const validators = require("./admin.validation");
const userStatus = require("../../middlewares/userStatus");
const userList = require("./controller/users");
///////////////////////////////////////////////////////
router.patch(
  "/deleteAccount/:id",
  validation(validators.deleteAccount),
  auth(endPoint.deleteAccount),
  userStatus,
  softDeleteAccount
);
router.get(
  "/userList",
  validation(validators.userList),
  auth(endPoint.userList),
  userStatus,
  userList
);
///////////////////////////////////////////////////////
module.exports = router;
