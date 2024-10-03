import express from 'express';
import registerRoutes from './routes/index.js';
import logger from './utils/logger.js';
import { pageNotFound } from './middleware/pageNotFound.js';
import noCache from './middleware/noCache.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(noCache);
registerRoutes(app);
app.use(pageNotFound);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;