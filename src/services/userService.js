import User from '../models/user.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcrypt';

export const createUser = async (userData) => {
  try {
    const { first_name, last_name, email, password } = userData;
    const user = await User.create({
      first_name,
      last_name,
      email,
      password
    });
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
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
}

export const updateUser = async (email, userData) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn('User not found', { email });
      throw new Error('User not found');
    }

    // Filter out empty fields and non-allowed fields
    const allowedFields = ['first_name', 'last_name', 'password'];
    const filteredData = Object.entries(userData)
      .filter(([key, value]) => 
        allowedFields.includes(key) && 
        value !== undefined && 
        value !== null && 
        value !== ''
      )
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    await user.update(filteredData);
    logger.info("User updated", { email, fields: Object.keys(userData) });
    return user;
  } catch (error) {
    logger.error("Error updating user", { email, error: error.message });
    throw error;
  }
}