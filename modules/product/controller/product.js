const userModel = require("../../../DB/models/User");
const { roles } = require("../../../middlewares/auth");
const productModel = require("../../../DB/models/Product");
const QRCode = require("qrcode");
const { getIo } = require("../../../services/socket");
///////////////////////////---createProduct---///////////////////////////
const createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const createdBy = req.user._id;

    const newProduct = new productModel({
      title,
      description,
      price,
      createdBy,
    });
    const savedProduct = await newProduct.save();
    QRCode.toDataURL(`${savedProduct}`, function (err, url) {
      if (err) {
        res.status(500).json(err);
      } else {
        getIo().emit("productAdded", savedProduct.title);
        res.status(201).json({ Product: savedProduct, QRcode: url });
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---updateProduct---///////////////////////////
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID Product
    const { title, description, price } = req.body;
    const createdBy = req.user._id;
    if (req.product.createdBy.toString() != createdBy) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this product" });
      return;
    }
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { title, description, price },
      { new: true }
    );
    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---deleteProduct---///////////////////////////
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID Product
    const { _id, role } = req.user; // ID User + Role User
    const findProduct = await productModel.findById(id);
    if (!findProduct) {
      res.status(404).json({ message: "Product ID does not exist" });
      return;
    }
    if (
      findProduct.createdBy.toString() == _id.toString() ||
      role == roles.Admin
    ) {
      const deletedProduct = await productModel.deleteOne({ _id: id });
      if (deletedProduct.deletedCount) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ message: "Product ID does not exist" });
      }
    } else {
      res.json({
        message: "You are not authorized to delete this product",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---softDeleteProduct---///////////////////////////
const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID Product
    const { _id, role } = req.user; // ID User + Role User
    if (
      req.product.createdBy.toString() == _id.toString() ||
      role == roles.Admin
    ) {
      await productModel.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        { new: true }
      );
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.json({
        message: "You are not authorized to delete this product",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---likeProduct/unlikeProduct---///////////////////////////
const likeProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID Product
    if (req.product.createdBy.toString() == req.user._id) {
      res.status(400).json({ message: "You can't like your product" });
      return;
    }
    if (req.product.likes.includes(req.user._id)) {
      await productModel.findByIdAndUpdate(id, {
        $pull: { likes: req.user._id },
      });
    } else {
      await productModel.findByIdAndUpdate(id, {
        $push: { likes: req.user._id },
      });
    }
    res.status(200).json({ message: "Done" });
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---addToWishList---///////////////////////////
const addToWishList = async (req, res) => {
  try {
    const { id } = req.params; // ID Product
    const { _id, role } = req.user; // ID User + Role User
    const userInfo = await userModel.findById(_id);
    if (userInfo.wishList.includes(id)) {
      res.status(409).json({ message: "This product already added" });
    } else {
      await userModel.findByIdAndUpdate(_id, {
        $push: { wishList: id },
      });
      res.status(200).json({ message: "Product added successfully" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
///////////////////////////---hideProduct---///////////////////////////
const hideProduct = async (req, res) => {
  try {
    const { id } = req.params; // ID Product
    const { _id, role } = req.user; // ID User + Role User
    if (
      req.product.createdBy.toString() == _id.toString() ||
      role == roles.Admin
    ) {
      await productModel.findByIdAndUpdate(
        id,
        {
          isHidden: true,
        },
        { new: true }
      );
      res.status(200).json({ message: "Product hid successfully" });
    } else {
      res.json({
        message: "You are not authorized to hide this product",
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  likeProduct,
  addToWishList,
  hideProduct,
};
