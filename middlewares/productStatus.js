const productModel = require("../DB/models/Product");

const productStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // ID Product
    const findProduct = await productModel.findById(id);
    if (!findProduct) {
      res.status(404).json({ message: "Product ID does not exist" });
      return;
    }
    if (findProduct.isDeleted === true) {
      res.status(401).json({
        message: "This product has been deleted",
      });
      return;
    }
    if (findProduct.isHidden === true) {
      res.status(401).json({
        message: "This product has been hidden",
      });
      return;
    }
    req.product = findProduct;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = productStatus;
