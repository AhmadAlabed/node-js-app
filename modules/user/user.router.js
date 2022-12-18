const router = require("express").Router();
///////////////////////////////////////////////////////
const validation = require("../../middlewares/validation");
const validators = require("./user.validation");
const profile = require("./controller/profile");
const endPoint = require("./user.endPoint");
const { auth } = require("../../middlewares/auth");
const userStatus = require("../../middlewares/userStatus");
const multer = require("../../services/multer");
///////////////////////////////////////////////////////
router.get(
  "/profile",
  validation(validators.userProfile),
  auth(endPoint.userProfile),
  userStatus,
  profile.userProfile
);
router.patch(
  "/updateProfile",
  validation(validators.updateProfile),
  auth(endPoint.updateProfile),
  userStatus,
  profile.updateProfile
);
router.patch(
  "/updatePassword",
  validation(validators.updatePassword),
  auth(endPoint.updatePassword),
  userStatus,
  profile.updatePassword
);
router.delete(
  "/:id",
  validation(validators.deleteAccount),
  auth(endPoint.deleteAccount),
  profile.deleteAccount
);
router.patch(
  "/profilePic",
  validation(validators.profilePic),
  auth(endPoint.profilePic),
  multer
    .myMulter("ProfilePic", multer.validationFile.imageFile)
    .array("image", 8),
  userStatus,
  profile.profilePic
);
router.patch(
  "/coverPic",
  validation(validators.coverPic),
  auth(endPoint.coverPic),
  multer
    .myMulter("CoverPic", multer.validationFile.imageFile)
    .array("image", 8),
  userStatus,
  profile.coverPic
);
///////////////////////////////////////////////////////
module.exports = router;
