const userRouter = require("./user/user.router");
const commentRouter = require("./comment/comment.router");
const productRouter = require("./product/product.router");
const authenticationRouter = require("./authentication/authentication.router");
const adminRouter = require("./admin/admin.router");

module.exports = {
  authenticationRouter,
  userRouter,
  productRouter,
  commentRouter,
  adminRouter,
};
