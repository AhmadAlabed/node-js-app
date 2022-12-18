const { roles } = require("../../middlewares/auth");

const endPoint = {
  userProfile: [roles.User, roles.Admin],
  //userProfileQR: [roles.User, roles.Admin],
  deleteAccount: [roles.User, roles.Admin],
  updateProfile: [roles.User, roles.Admin],
  updatePassword: [roles.User, roles.Admin],
  profilePic: [roles.User, roles.Admin],
  coverPic: [roles.User, roles.Admin],
};
module.exports = endPoint;
