import * as userService from "../services/userService.js";
import logger from "../utils/logger.js";

export const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.warn("Attempt to create user with existing email", { email: req.body.email });
      return res.status(400).send();
    }
    if (error.name === 'SequelizeValidationError') {
      logger.warn("Validation error when creating user:", { error: error.message });
      return res.status(400).send();
    }
    logger.error("Error creating user", { error: error.message });
    res.status(500).send();
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.auth.user);
    return res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    logger.error('Error fetching user', { error: error.message });
    if (error.message === 'User not found') {
      logger.error('User not found');
      return res.status(404).send();
    }
    res.status(500).send();
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.auth.user, req.body);
    return res.status(204).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      account_created: user.account_created,
      account_updated: user.account_updated
    });
  } catch (error) {
    logger.error("Error updating user", { error: error.message });
    if (error.message === 'User not found') {
      logger.error('User not found');
      return res.status(404).send();
    }
    if (error.name === 'SequelizeValidationError') {
      logger.warn("Validation error when creating user:", { error: error.message });
      return res.status(400).send();
    }
    res.status(500).send();
  }
}