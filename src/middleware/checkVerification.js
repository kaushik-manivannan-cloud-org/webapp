import User from "../models/user.js";
import logger from "../utils/logger.js";

export const checkVerification = async (req, res, next) => {

  try {
    // Get user from auth middleware
    const user = await User.findOne({ where: { email: req.auth.user } });

    // Check if user is verified
    if (!user.verified) {
      logger.warn("User not verified", { email: req.auth.user });
      return res.status(403).send();
    }

    next();
  } catch (error) {
    logger.error('Error checking verification status:', error);
  }
};