import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

export const checkDatabaseHealth = async () => {
  
  let healthCheckSequelize = null;
  
  try {
    healthCheckSequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: msg => logger.debug(msg),
      }
    );

    await healthCheckSequelize.authenticate();
    logger.info("Database connection established successfully!");
    return true;
  } catch(error) {
    logger.error("Database connection failed: ", { error: error.message });
    return false;
  } finally {
    if (healthCheckSequelize) {
      logger.debug("Closing database connection...");
      healthCheckSequelize.close()
    }
  }
}