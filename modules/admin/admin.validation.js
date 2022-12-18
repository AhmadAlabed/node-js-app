const Joi = require("joi");
///////////////////////////////////////////////////////
const deleteAccount = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().min(24).max(24).required(),
    }),
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
///////////////////////////////////////////////////////
const userList = {
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
///////////////////////////////////////////////////////
module.exports = { deleteAccount, userList };
