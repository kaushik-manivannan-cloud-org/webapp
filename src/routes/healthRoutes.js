import express from 'express';
import logger from '../utils/logger.js';
import { checkHealth } from '../controllers/healthController.js';
import { checkNoPayload } from '../middleware/checkNoPayload.js';
import noCache from '../middleware/noCache.js';

const router = express.Router();

router.route('/')
  .all(
    checkNoPayload,
    noCache,
    (req, res, next) => {
    logger.info("Health check request received");
    next();
    },
    checkHealth
  );

export default router;