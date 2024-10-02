import User from "../models/user.js";
import logger from "../utils/logger.js";

export const createUser = async (userData) => {
  try {
    const user = await User.create(userData);
    logger.info("User created successfully", { userId: user.id });
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn('User not found', { email });
      throw new Error('User not found')
    }
    return user;
  } catch (error) {
    throw error;
  }
}