import basicAuth from 'express-basic-auth';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';

const auth = basicAuth({
  authorizer: async (email, password, cb) => {
    try {
      logger.info('Authentication attempt', { email });
      const user = await User.findOne({ where: { email } });
      if (!user) {
        logger.warn('Authentication failed: User not found', { email });
        return cb(null, false);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        logger.info('Authentication successful', { email });
        cb.user = user;
        return cb(null, true);
      } else {
        logger.warn('Authentication failed: Invalid password', { email });
        return cb(null, false);
      }
    } catch (error) {
      logger.error('Authentication error', { email, error: error.message });
      return cb(null, false);
    }
  },
  authorizeAsync: true,
  unauthorizedResponse: (req) => {
    logger.warn('Unauthorized access attempt', { 
      ip: req.ip, 
      path: req.path 
    });
  },
});

export default auth;