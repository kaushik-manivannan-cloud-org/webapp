import sequelize from './database.js';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {

  try {
    // Verify database connection by attempting authentication
    await sequelize.authenticate();
    logger.info('Sequelize connected to the application database successfully');

    // Sync all models
    // { alter: true } option modifies existing tables to match model changes
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized successfully');

    return sequelize;
  } catch (error) {
    logger.error('Error in database initialization:', error);
    return false;
  }
}

export default initDatabase;