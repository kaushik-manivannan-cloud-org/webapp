import { verifyUser } from '../services/verificationService.js';
import logger from '../utils/logger.js';

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    await verifyUser(token);
    res.status(200).send();
  } catch (error) {
    logger.error('Error verifying user:', error);
    if (error.message === 'Invalid or expired token') {
      return res.status(400).send();
    } else if (error.message === 'No token provided in request') {
      return res.status(400).send();
    }
  }
};