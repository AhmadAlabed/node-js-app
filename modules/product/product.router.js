const router = require("express").Router();
///////////////////////////////////////////////////////
const { auth } = require("../../middlewares/auth");
const validation = require("../../middlewares/validation");
const validators = require("./product.validation");
///////////////////////////////////////////////////////
const { myMulter, validationFile } = require("../../services/multer");
const productController = require("../product/controller/product");
const endPoint = require("./product.endPoint");
const productStatus = require("../../middlewares/productStatus");
const userStatus = require("../../middlewares/userStatus");
///////////////////////////////////////////////////////
router.post(
  "/",
  validation(validators.createProduct),
  auth(endPoint.createProduct),
  userStatus,
  productController.createProduct
);
router.patch(
  "/:id",
  validation(validators.updateProduct),
  auth(endPoint.updateProduct),
  userStatus,
  productStatus,
  productController.updateProduct
);
router.delete(
  "/:id",
  validation(validators.deleteProduct),
  auth(endPoint.deleteProduct),
  userStatus,
  productController.deleteProduct
);
router.patch(
  "/:id/delete",
  validation(validators.softDeleteProduct),
  auth(endPoint.softDeleteProduct),
  userStatus,
  productStatus,
  productController.softDeleteProduct
);
router.patch(
  "/:id/like",
  validation(validators.likeProduct),
  auth(endPoint.likeProduct),
  userStatus,
  productStatus,
  productController.likeProduct
);
router.patch(
  "/:id/addToWishList",
  validation(validators.addToWishList),
  auth(endPoint.addToWishList),
  userStatus,
  productStatus,
  productController.addToWishList
);
router.patch(
  "/:id/hide",
  validation(validators.hideProduct),
  auth(endPoint.hideProduct),
  userStatus,
  productStatus,
  productController.hideProduct
);
///////////////////////////////////////////////////////
module.exports = router;
