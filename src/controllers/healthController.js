import * as healthService from '../services/healthService.js';
import logger from '../utils/logger.js';

export const checkHealth = async (req, res) => {
  try {
    const isDatabaseHealthy = await healthService.checkDatabaseHealth();
    if (isDatabaseHealthy) {
      logger.info('Database health check passed!');
      res.status(200).send();
    } else {
      logger.warn('Database health check failed: database unhealthy');
      res.status(503).send();
    }
  } catch (error) {
    logger.error('Database health check failed with error: ', error);
    res.status(500).send();
  }
};