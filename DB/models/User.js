const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: Array,
    coverPic: Array,
    QRcode: String,
    emailConfirm: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    forgotPasswordCode: String,
    role: { type: String, default: "User" },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(process.env.SALT_ROUND)
  );
  next();
});
const updateHooks = ["findOneAndUpdate"];
updateHooks.forEach((key) => {
  userSchema.pre(key, async function () {
    let data = await this.model.findOne(this.getQuery());
    this.set({ __v: data.__v + 1 });
  });
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
