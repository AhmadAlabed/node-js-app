const router = require("express").Router();
///////////////////////////////////////////////////////
const { auth } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./comment.validation");
const commentController = require("../comment/controller/comment");
const endPoint = require("./comment.endPoint");
const userStatus = require("../../middlewares/userStatus");
const productStatus = require("../../middlewares/productStatus");
///////////////////////////////////////////////////////
router.post(
  "/:id",
  validation(validators.createComment),
  auth(endPoint.createComment),
  userStatus,
  productStatus,
  commentController.createComment
);
router.patch(
  "/:id",
  validation(validators.updateComment),
  auth(endPoint.updateComment),
  userStatus,
  commentController.updateComment
);
router.delete(
  "/:id",
  validation(validators.deleteComment),
  auth(endPoint.deleteComment),
  userStatus,
  commentController.deleteComment
);
//likeComment/unlikeComment + likeReply/unlikeReply
router.patch(
  "/:id/like",
  validation(validators.like),
  auth(endPoint.like),
  userStatus,
  commentController.like
);
//ReplyComment + ReplyReply
router.post(
  "/:id/reply",
  validation(validators.createReply),
  auth(endPoint.createReply),
  userStatus,
  commentController.createReply
);
///////////////////////////////////////////////////////
module.exports = router;
