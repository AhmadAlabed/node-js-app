const { roles } = require("../../middlewares/auth");

const endPoint = {
  createProduct: [roles.User, roles.Admin],
  updateProduct: [roles.User, roles.Admin],
  deleteProduct: [roles.User, roles.Admin],
  softDeleteProduct: [roles.User, roles.Admin],
  likeProduct: [roles.User, roles.Admin],
  addToWishList: [roles.User, roles.Admin],
  hideProduct: [roles.User, roles.Admin],
};
module.exports = endPoint;
