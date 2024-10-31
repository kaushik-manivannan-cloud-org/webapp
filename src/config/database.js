import { Sequelize } from 'sequelize';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
import statsd from '../services/metricsService.js';

dotenv.config();

// Create a new Sequelize instance for the application database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // Enable built-in query timing
    benchmark: true,
    logging: (msg, timing) => {
      logger.debug(msg)

      // Determine query type
      const queryType = msg.trim().split(' ')[0].toLowerCase();
      
      // Track query timing
      statsd.timing('database.query.duration', timing);
      statsd.timing(`database.query.${queryType}.duration`, timing);
      
      // Track query counts
      statsd.increment('database.query.count');
      statsd.increment(`database.query.${queryType}.count`);
    },
  }
);

export default sequelize;