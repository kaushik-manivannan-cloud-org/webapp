import express from 'express';
import registerRoutes from './routes/index.js';
import logger from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
registerRoutes(app);

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", { error: err });
});

process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection", { error: err });
});

