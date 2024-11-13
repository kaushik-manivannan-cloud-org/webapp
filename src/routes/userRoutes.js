import express from 'express';
import logger from '../utils/logger.js';
import { methodNotAllowed } from '../middleware/methodNotAllowed.js';
import { createUser, getUser, updateUser } from '../controllers/userController.js';
import { validatePayload } from '../middleware/validatePayload.js';
import { checkNoPayload } from '../middleware/checkNoPayload.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchemas.js';
import auth from '../middleware/auth.js';
import checkAuth from '../middleware/checkAuth.js';
import { uploadProfilePic, getProfilePic, deleteProfilePic } from '../controllers/imageController.js';
import { handleFileUpload } from '../middleware/handleFileUpload.js';
import metricsMiddleware from '../middleware/metricsMiddleware.js';
import { checkQueryParams } from '../middleware/checkQueryParams.js';

const router = express.Router();

// Collect metrics for each request
router.use(metricsMiddleware);

router.route('/')
  .post(
    (req, res, next) => {
    logger.info("User creation request received");
    next();
    },
    checkAuth,
    validatePayload(createUserSchema),
    createUser
  )
  .all(
    methodNotAllowed(['POST'])
  );

router.route('/self')
  .all(
    methodNotAllowed(['GET', 'PUT'])
  )
  .get(
    (req, res, next) => {
      logger.info("Fetch user request received");
      next();
    },
    checkNoPayload,
    checkQueryParams,
    auth,
    getUser
  )
  .put(
    (req, res, next) => {
      logger.info("User update request received");
      next();
      },
    validatePayload(updateUserSchema),
    auth,
    updateUser
  )

router.route('/self/pic')
  .all(
    methodNotAllowed(['GET', 'POST', 'DELETE']))
  .get(
    checkNoPayload,
    checkQueryParams,
    auth,
    getProfilePic
  )
  .post(
    auth,
    handleFileUpload,
    uploadProfilePic
  )
  .delete(
    checkNoPayload,
    checkQueryParams,
    auth,
    deleteProfilePic
  );

export default router;