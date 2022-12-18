const commentModel = require("../../../DB/models/Comment");
const { roles } = require("../../../middlewares/auth");
const productModel = require("../../../DB/models/Product");
const { getIo } = require("../../../services/socket");
///////////////////////////---createComment---///////////////////////////
const createComment = async (req, res) => {
  try {
    const { id } = req.params; //id product
    const { body } = req.body;
    const commentBy = req.user._id;

    const newComment = new commentModel({
      body,
      commentBy,
      productId: id,
    });
    const savedComment = await newComment.save();
    await productModel.findByIdAndUpdate(id, {
      $push: { comments: savedComment._id },
    });
    getIo().emit("commentAdded", savedComment.body);
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---updateComment---///////////////////////////
const updateComment = async (req, res) => {
  try {
    const { id } = req.params; //id comment
    const { body } = req.body;
    const findComment = await commentModel.findById(id);
    if (!findComment) {
      res.status(404).json({ message: "Comment ID does not exist" });
      return;
    }
    if (findComment.commentBy.toString() == req.user._id.toString()) {
      const updatedComment = await commentModel.findByIdAndUpdate(
        id,
        { body },
        { new: true }
      );
      res.status(201).json(updatedComment);
    } else {
      res.json({
        message: "You are not authorized to update this comment",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---deleteComment---///////////////////////////
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params; // ID Comment
    const { _id, role } = req.user; // ID User + Role User
    const findComment = await commentModel.findById(id);
    if (!findComment) {
      res.status(404).json({ message: "Comment ID does not exist" });
      return;
    }
    if (
      findComment.commentBy.toString() == _id.toString() ||
      role == roles.Admin
    ) {
      const deletedComment = await commentModel.deleteOne({ _id: id });
      if (deletedComment.deletedCount) {
        await productModel.findByIdAndUpdate(findComment.productId, {
          $pull: { comments: findComment._id },
        });
        res.json({ message: "Comment deleted successfully" });
      } else {
        res.status(404).json({ message: "Comment ID does not exist" });
      }
    } else {
      res.json({
        message: "You are not authorized to delete this comment",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---likeComment/unlikeComment + likeReply/unlikeReply---///////////////////////////
const like = async (req, res) => {
  try {
    const { id } = req.params; // ID Comment
    const findComment = await commentModel.findById(id);
    if (!findComment) {
      res.status(404).json({ message: "Comment ID does not exist" });
      return;
    }
    if (findComment.commentBy.toString() == req.user._id) {
      res.status(400).json({ message: "You can't like your comment" });
      return;
    }
    if (findComment.likes.includes(req.user._id)) {
      await commentModel.findByIdAndUpdate(findComment._id, {
        $pull: { likes: req.user._id },
      });
    } else {
      await commentModel.findByIdAndUpdate(findComment._id, {
        $push: { likes: req.user._id },
      });
    }
    res.status(200).json({ message: "Done" });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---ReplyComment + ReplyReply---///////////////////////////
const createReply = async (req, res) => {
  try {
    const { id } = req.params; // ID Comment
    const { body } = req.body;
    const commentBy = req.user._id;
    const findComment = await commentModel.findById(id);
    if (!findComment) {
      res.status(404).json({ message: "Comment ID does not exist" });
      return;
    }
    const newComment = new commentModel({
      body,
      commentBy,
      productId: findComment.productId,
    });
    const savedComment = await newComment.save();
    await commentModel.findByIdAndUpdate(findComment._id, {
      $push: { replies: savedComment._id },
    });
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createComment,
  updateComment,
  deleteComment,
  createReply,
  like,
};
