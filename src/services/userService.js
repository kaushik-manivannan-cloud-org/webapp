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
