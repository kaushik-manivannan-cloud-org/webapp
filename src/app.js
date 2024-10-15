import express from 'express';
import registerRoutes from './routes/index.js';
import logger from './utils/logger.js';
import { pageNotFound } from './middleware/pageNotFound.js';
import noCache from './middleware/noCache.js';
import initDatabase from './config/initDatabase.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(noCache);
registerRoutes(app);
app.use(pageNotFound);

const startServer = async () => {
  try {
    const dbInitialized = await initDatabase();
    if (dbInitialized) {
      logger.info('Database initialized successfully');
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    } else {
      logger.warn('Database initialization failed. Starting server without database connection.');
      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;