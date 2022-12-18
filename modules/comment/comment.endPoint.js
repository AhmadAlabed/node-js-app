const { roles } = require("../../middlewares/auth");

const endPoint = {
  createComment: [roles.User, roles.Admin],
  updateComment: [roles.User, roles.Admin],
  deleteComment: [roles.User, roles.Admin],
  like: [roles.User, roles.Admin],
  createReply: [roles.User, roles.Admin],
};
module.exports = endPoint;
