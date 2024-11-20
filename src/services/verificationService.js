import { Op } from 'sequelize';
import User from '../models/user.js';
import logger from '../utils/logger.js';

export const verifyUser = async (token) => {
  try {
    if (!token) {
      logger.warn('No token provided in request');
      throw new Error('No token provided in request');
    }

    const user = await User.findOne({
      where: {
        verification_token: token,
        token_expiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      logger.warn('Invalid or expired verification token attempted', { token });
      throw new Error('Invalid or expired token');
    }

    // Check if user is already verified
    if (user.verified) {
      logger.warn('Already verified user attempted verification again', { 
        userId: user.id,
        email: user.email 
      });
      throw new Error('User already verified');
    }

    await user.update({
      verified: true,
      verification_token: null,
      token_expiry: null
    });

    logger.info('User verified successfully', { userId: user.id });
    return user;
  } catch (error) {
    logger.error('Error in verification service:', error);
    throw error;
  }
};