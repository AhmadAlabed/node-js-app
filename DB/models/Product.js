const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isHidden: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const updateHooks = ["findOneAndUpdate"];
updateHooks.forEach((key) => {
  productSchema.pre(key, async function () {
    let data = await this.model.findOne(this.getQuery());
    this.set({ __v: data.__v + 1 });
  });
});
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
