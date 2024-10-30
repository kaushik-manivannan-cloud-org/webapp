import logger from '../utils/logger.js';
import Image from '../models/image.js';
import { deleteFromS3, uploadToS3 } from '../services/s3Service.js';

export const addImage = async (file, userId) => {
  try {
    // Check if user already has a profile image
    const existingImage = await Image.findOne({ where: { user_id: userId }});
    if (existingImage) {
      logger.warn('User already has a profile image', { userId });
      throw new Error('Profile Image already exists');
    }

    // Upload image to S3
    const s3Key = await uploadToS3(file, userId);

    // Create database record
    const image = await Image.create({
      file_name: file.originalname,
      url: s3Key,
      user_id: userId,
      upload_date: new Date().toISOString().split('T')[0],
    });

    logger.info('Profile Image uploaded successfully', { userId, imageId: image.id });
    return image;
  } catch (error) {
    // If S3 upload succeeded but database insert failed, clean up the S3 file
    if (error.name === 'SequelizeError' && s3Key) {
      try {
        await deleteFromS3(s3Key);
        logger.info('Cleaned up S3 file after database error', { key: s3Key });
      } catch (cleanupError) {
        logger.error('Failed to clean up S3 file after error', { key: s3Key, error: cleanupError });
      }
    }
    throw error;
  }
};

export const getImage = async (userId) => {
  try {
    const image = await Image.findOne({ where: { user_id: userId } });
    if (!image) {
      logger.warn('Profile Image not found', { userId });
      throw new Error('Image not found');
    }
    return image;
  } catch (error) {
    logger.error('Error getting profile image:', error);
    throw error;
  }
};

export const deleteImage = async (userId) => {
  try {
    const image = await Image.findOne({ where: { user_id: userId } });
    if (!image) {
      logger.warn('Profile image not found for deletion', { userId });
      throw new Error('Image not found');
    }

    // Delete image from S3
    await deleteFromS3(image.url);

    // Delete database record
    await image.destroy();

    logger.info('Profile Image deleted successfully', { userId });
  } catch (error) {
    logger.error('Error deleting profile image:', error);
    throw error;
  }
};