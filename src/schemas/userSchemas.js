import Joi from "joi";

export const createUserSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export const updateUserSchema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  password: Joi.string()
}).min(1);