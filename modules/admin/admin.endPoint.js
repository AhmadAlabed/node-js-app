const { roles } = require("../../middlewares/auth");

const endPoint = {
  deleteAccount: [roles.Admin],
  userList: [roles.Admin],
};
module.exports = endPoint;
