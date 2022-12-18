const Joi = require("joi");
///////////////////////////////////////////////////////
const createComment = {
  body: Joi.object().required().keys({
    body: Joi.string().required(),
  }),
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
const updateComment = {
  body: Joi.object().required().keys({
    body: Joi.string().required(),
  }),
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
const like = {
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
const createReply = {
  params: Joi.object()
    .required()
    .keys({
      id: Joi.string().min(24).max(24).required(),
    }),
  body: Joi.object().required().keys({
    body: Joi.string().required(),
  }),
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
///////////////////////////////////////////////////////
const deleteComment = {
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
module.exports = {
  createComment,
  updateComment,
  like,
  createReply,
  deleteComment,
};
