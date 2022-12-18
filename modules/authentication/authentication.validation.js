const Joi = require("joi");
///////////////////////////////////////////////////////
const signup = {
  body: Joi.object()
    .required()
    .keys({
      userName: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string()
        .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
        .required()
        .messages({
          "string.pattern.base":
            "minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
        }),
      cPassword: Joi.string().valid(Joi.ref("password")).required(),
    }),
};
///////////////////////////////////////////////////////
const emailConfirm = {
  params: Joi.object().required().keys({
    token: Joi.string().required(),
  }),
};
///////////////////////////////////////////////////////
const resendToken = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().min(24).max(24).required(),
    }),
};
///////////////////////////////////////////////////////
const signin = {
  body: Joi.object()
    .required()
    .keys({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string()
        .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
        .required()
        .messages({
          "string.pattern.base":
            "minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
        }),
    }),
};
///////////////////////////////////////////////////////
const signout = {
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

///////////////////////////////////////////////////////
const forgotPassword = {
  body: Joi.object()
    .required()
    .keys({
      code: Joi.string()
        .length(4)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({ "string.pattern.base": "can only contain numbers" }),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      newPassword: Joi.string()
        .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
        .required()
        .messages({
          "string.pattern.base":
            "minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
        }),
      cPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    }),
};
///////////////////////////////////////////////////////
const sendCode = {
  body: Joi.object()
    .required()
    .keys({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
    }),
};
///////////////////////////////////////////////////////
module.exports = {
  signup,
  emailConfirm,
  signin,
  signout,
  resendToken,
  forgotPassword,
  sendCode,
};
