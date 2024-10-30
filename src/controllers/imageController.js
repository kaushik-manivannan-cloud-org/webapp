import User from '../models/user.js';
import * as imageService from '../services/imageService.js';
import logger from '../utils/logger.js';

export const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.auth.user } });
    const image = await imageService.addImage(req.file, user.id);
    res.status(201).json({
      file_name: image.file_name,
      id: image.id,
      url: image.url,
      upload_date: image.upload_date,
      user_id: image.user_id
    });
  } catch (error) {
    if (error.message === 'Profile Image already exists') {
      logger.warn('Attempted to upload profile pic when one already exists', {
        userId: req.auth.user.id
      });
      return res.status(400).send();
    }

    if (error.message === 'Invalid file format') {
      return res.status(400).json({
        message: 'Invalid image format.'
      });
    }

    if (error.name === 'SequelizeValidationError') {
      logger.warn('Database validation error', { error: error.message });
      return res.status(400).send();
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.warn('Database unique constraint error', {
        error: error.message
      });
      return res.status(400).send();
    }

    // For any other service errors, return a 400
    logger.error('Unexpected service error', {
      error: error.message,
      stack: error.stack
    });
    return res.status(400).send();
  }
};

export const getProfilePic = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.auth.user } });
    const image = await imageService.getImage(user.id);
    res.status(200).json({
      file_name: image.file_name,
      id: image.id,
      url: image.url,
      upload_date: image.upload_date,
      user_id: image.user_id
    });
  } catch (error) {
    if (error.message === 'Image not found') {
      return res.status(404).send();
    }
    
    logger.error('Error retrieving profile image', {
      error: error.message,
      userId: req.auth.user.id
    });
    return res.status(400).send();
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.auth.user } });
    await imageService.deleteImage(user.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Image not found') {
      return res.status(404).send();
    }

    logger.error('Error deleting profile image', {
      error: error.message,
      userId: req.auth.user.id
    });
    return res.status(400).send();
  }
};