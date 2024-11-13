import logger from "../utils/logger.js";

export const checkQueryParams = (req, res, next) => {

    // Check for query parameters
    if (Object.keys(req.query).length > 0) {
      logger.warn('Request received with query parameters');
      return res.status(400).send();
    }
    
    next();
};