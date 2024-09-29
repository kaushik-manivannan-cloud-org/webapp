import logger from '../utils/logger.js';

export const methodNotAllowed = (allowedMethods) => (req, res, next) => {
  const method = req.method;

  // Block HEAD requests explicitly, even if GET is allowed
  if (method === 'HEAD') {
    const parentRoute = req.baseUrl || '/';
    logger.warn(`Method HEAD not allowed on ${parentRoute}${req.path}`);
    return res.status(405).send();
  }

  // Check for allowed methods
  if (!allowedMethods.includes(method)) {
    const parentRoute = req.baseUrl || '/';
    logger.warn(`Method ${method} not allowed on ${parentRoute}${req.path}`);
    return res.status(405).send();
  } else {
    next();
  }
};