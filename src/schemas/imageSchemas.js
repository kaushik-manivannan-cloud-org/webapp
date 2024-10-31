import Joi from "joi";

export const createImageSchema = Joi.object({
  profilePic: Joi.binary().required().messages({
    'any.required': 'Profile picture is required',
    'binary.base': 'Profile picture must be a valid image file'
  })
}).messages({
  'object.unknown': 'Unknown fields are not allowed'
});