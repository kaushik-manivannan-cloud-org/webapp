import express from 'express';
import logger from '../utils/logger.js';
import { checkHealth } from '../controllers/healthController.js';
import { checkNoPayload } from '../middleware/checkNoPayload.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';

const router = express.Router();

// Collect metrics for each request
router.use(metricsMiddleware);

router.route('/')
  .all(
    methodNotAllowed(['GET'])
  )
  .get(
    checkNoPayload,
    (req, res, next) => {
    logger.info("Health check request received");
    next();
    },
    checkHealth
  );

export default router;