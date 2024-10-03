import Joi from "joi";

export const createUserSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  account_created: Joi.any().optional(),
  account_updated: Joi.any().optional(),
})

export const updateUserSchema = Joi.object({
  first_name: Joi.string().allow(''),
  last_name: Joi.string().allow(''),
  password: Joi.string().allow(''),
  account_created: Joi.any().optional(),
  account_updated: Joi.any().optional(),
})
.custom((obj, helpers) => {
  if (!obj.first_name && !obj.last_name && !obj.password) {
    return helpers.error('object.atLeastOneRequired');
  }
  return obj;
}, 'At least one field check')
.messages({
  'object.atLeastOneRequired': 'At least one of first_name, last_name, or password must be provided'
});;