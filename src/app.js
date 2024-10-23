import express from 'express';
import registerRoutes from './routes/index.js';
import logger from './utils/logger.js';
import { pageNotFound } from './middleware/pageNotFound.js';
import noCache from './middleware/noCache.js';
import initDatabase from './config/initDatabase.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express application
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(noCache); // Prevent response caching

// Register application routes
registerRoutes(app);

// Handle 404 errors for unmatched routes
app.use(pageNotFound);

// Start the server and connect to the database
const startServer = async () => {
  try {
    // Initialize database connection
    const dbInitialized = await initDatabase();
    if (dbInitialized) {
      logger.info('Database initialized successfully');
    } else {
      // Continue server startup even if database fails to initialize
      logger.warn('Database initialization failed. Starting server without database connection.');
    }
  } catch (error) {
    // Log fatal errors and exit process
    logger.error('Failed to start server:', error);
    process.exit(1);
  } finally {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  }
};

// Initialize the server
startServer();

export default app;