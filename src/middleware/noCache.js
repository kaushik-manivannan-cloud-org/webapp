import logger from "../utils/logger.js";

export default (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  logger.debug('No-cache headers set');
  next();
}