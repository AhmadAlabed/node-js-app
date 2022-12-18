const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const updateHooks = ["findOneAndUpdate"];
updateHooks.forEach((key) => {
  commentSchema.pre(key, async function () {
    let data = await this.model.findOne(this.getQuery());
    this.set({ __v: data.__v + 1 });
  });
});
const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
