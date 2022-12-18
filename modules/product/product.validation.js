const Joi = require("joi");
///////////////////////////////////////////////////////
const updateProduct = {
  body: Joi.object()
    .required()
    .keys({
      title: Joi.string().min(5).max(100).required(),
      description: Joi.string().min(1).max(500).required(),
      price: Joi.number().required(),
    }),
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
///////////////////////////////////////////////////////
const createProduct = {
  body: Joi.object()
    .required()
    .keys({
      title: Joi.string().min(5).max(100).required(),
      description: Joi.string().min(1).max(500).required(),
      price: Joi.number().required(),
    }),
  headers: Joi.object()
    .required()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
///////////////////////////////////////////////////////
const deleteProduct = {
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
const softDeleteProduct = {
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
const hideProduct = {
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
const likeProduct = {
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
const addToWishList = {
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
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  likeProduct,
  addToWishList,
  hideProduct,
};
