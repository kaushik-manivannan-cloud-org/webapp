import logger from "../utils/logger.js";

export const checkNoPayload = (req, res, next) => {

    // Check for query parameters
    if (Object.keys(req.query).length > 0) {
      logger.warn('Request received with query parameters');
      return res.status(400).send();
    }

    // Check for any headers that might indicate a payload
    const contentLength = req.headers['content-length'];
    const contentType = req.headers['content-type'];
    if (contentLength !== undefined) {
      logger.warn('Request received with non-zero content length');
      return res.status(400).send();
    }
    if (contentType && contentType !== 'application/json') {
      logger.warn(`Request received with unexpected content type: ${contentType}`);
      return res.status(400).send();
    }

    // Check for any parsed body
    if (req.body && Object.keys(req.body).length > 0) {
      logger.warn('Request received with non-empty body');
      return res.status(400).send();
    }
    
    next();
};