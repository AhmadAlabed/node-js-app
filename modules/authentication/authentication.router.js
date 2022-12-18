const router = require("express").Router();
///////////////////////////////////////////////////////
const authentication = require("./controller/authentication");
const validation = require("../../middlewares/validation");
const validators = require("./authentication.validation");
///////////////////////////////////////////////////////
router.post("/signup", validation(validators.signup), authentication.signup);
router.get(
  "/emailConfirm/:token",
  validation(validators.emailConfirm),
  authentication.emailConfirm
);
router.get(
  "/resendToken/:id",
  validation(validators.resendToken),
  authentication.resendToken
);
router.post("/signin", validation(validators.signin), authentication.signin);
router.patch(
  "/sendCode",
  validation(validators.sendCode),
  authentication.sendCode
);
router.patch(
  "/forgotPassword",
  validation(validators.forgotPassword),
  authentication.forgotPassword
);
///////////////////////////////////////////////////////
module.exports = router;
