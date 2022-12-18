const Joi = require("joi");
///////////////////////////////////////////////////////
const userProfile = {
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
const updateProfile = {
  body: Joi.object()
    .required()
    .keys({
      userName: Joi.string().alphanum().min(3).max(30).required(),
      firstName: Joi.string().alphanum().min(3).max(30),
      lastName: Joi.string().alphanum().min(3).max(30),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
    }),
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
const deleteAccount = {
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().min(24).max(24).required(),
    }),
};
///////////////////////////////////////////////////////
const updatePassword = {
  body: Joi.object()
    .required()
    .keys({
      oldPassword: Joi.string()
        .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
        .required()
        .messages({
          "string.pattern.base":
            "minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
        }),
      newPassword: Joi.string()
        .pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
        .required()
        .messages({
          "string.pattern.base":
            "minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
        }),
      cPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
    }),
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
///////////////////////////////////////////////////////
const profilePic = {
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
}; //
///////////////////////////////////////////////////////
const coverPic = {
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
///////////////////////////////////////////////////////
module.exports = {
  userProfile,
  updateProfile,
  deleteAccount,
  updatePassword,
  profilePic,
  coverPic,
};
