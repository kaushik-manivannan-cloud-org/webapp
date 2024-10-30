import multer from 'multer';
import logger from '../utils/logger.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.mimetype)) {
    logger.warn('Invalid file type uploaded. Only JPEG, JPG and PNG allowed.', { mimetype: file.mimetype });
    cb(new Error('Invalid file type. Only JPEG, JPG and PNG allowed.'), false);
    return;
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

export const handleFileUpload = (req, res, next) => {
  upload.single('profilePic')(req, res, function(err) {
    // Log the upload attempt
    logger.info('Profile picture upload attempt', {
      userId: req.auth?.user?.id,
      contentType: req.headers['content-type']
    });

    if (err instanceof multer.MulterError) {
      // Handle specific Multer errors
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          logger.warn('File size limit exceeded', {
            userId: req.auth?.user?.id,
            error: err.code
          });
          return res.status(400).send();

        case 'LIMIT_UNEXPECTED_FILE':
          logger.warn('Unexpected field name', {
            userId: req.auth?.user?.id,
            error: err.code,
            field: err.field
          });
          return res.status(400).send();

        default:
          logger.warn('Multer error occurred', {
            userId: req.auth?.user?.id,
            error: err.code,
            message: err.message
          });
          return res.status(400).send();
      }
    } 
    // Add specific catch for invalid file type
    else if (err && err.message.includes('Invalid file type')) {
      logger.warn('Invalid file type', {
        userId: req.auth?.user,
        error: err.message
      });
      return res.status(400).send();
    }
    else if (err) {
      // Handle non-Multer errors (like file filter errors)
      logger.error('File upload error', {
        userId: req.auth?.user?.id,
        error: err.message
      });
      return res.status(500).send();
    }

    // Validate that a file was actually uploaded
    if (!req.file) {
      logger.warn('No file provided in upload request', {
        userId: req.auth?.user?.id
      });
      return res.status(400).send();
    }

    // Log successful upload
    logger.info('File successfully processed by multer', {
      userId: req.auth?.user?.id,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    next();
  });
};