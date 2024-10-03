import Joi from "joi";
import logger from '../utils/logger.js';

export const validatePayload = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message.replace(/['"]/g, '')
    }));
    
    logger.warn('Payload validation failed', { errors: errorMessages });
    
    return res.status(400).send();
  }
  next();
}
