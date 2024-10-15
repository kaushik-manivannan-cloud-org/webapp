import logger from "../utils/logger.js";

export default (req, res, next) => {
  if (req.headers.authorization) {
    logger.error('Authorization header present in User creation request');
    return res.status(400).send();
  }
  next();
}