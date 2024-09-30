import Joi from "joi";
import logger from '../utils/logger.js';

export const validatePayload = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    logger.warn('Payload validation failed: ', { errors: error.details });
    return res.status(400).send();
  }
  next();
}
