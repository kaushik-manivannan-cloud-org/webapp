import { verifyUser } from '../services/verificationService.js';
import logger from '../utils/logger.js';

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    await verifyUser(token);
    res.status(200).json({ 
      message: 'Email verification successful!'
    });
  } catch (error) {
    logger.error('Error verifying user:', error);
    if (error.message === 'Invalid or expired token') {
      return res.status(400).json({
        error: 'Verification failed',
        message: 'The verification token is invalid or has expired. Please create a new account.'
      });
    } else if (error.message === 'No token provided in request') {
      return res.status(400).json({
        error: 'Verification failed',
        message: 'No verification token was provided in the request.',
      });
    } else if (error.message === 'User already verified') {
      return res.status(400).json({
        message: 'This account has already been verified.'
      });
    }
  }
};