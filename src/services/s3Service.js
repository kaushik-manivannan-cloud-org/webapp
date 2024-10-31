import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";
import statsd from "./metricsService.js";


const s3Client = new S3Client({ region: process.env.AWS_REGION });

// Middleware to track timing
s3Client.middlewareStack.add(
  (next, context) => async (args) => {
    const startTime = Date.now();
    try {
      const result = await next(args);
      const duration = Date.now() - startTime;
      statsd.timing('s3.operation.duration', duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      statsd.timing('s3.operation.duration', duration);
      throw error;
    }
  },
  {
    step: 'build'
  }
);

export const uploadToS3 = async (file, userId) => {
  const fileExtension = file.originalname.split(".").pop().toLowerCase();
  const key = `profile-pics/${userId}/${uuidv4()}.${fileExtension}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
    logger.info('File uploaded to S3 successfully', { key });
    return key;
  } catch (error) {
    logger.error("Error uploading file to S3:", error);
    throw error;
  }
};

export const deleteFromS3 = async (key) => {
  const deleteParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    logger.info('File deleted from S3 successfully', { key });
  } catch (error) {
    logger.error("Error deleting file from S3:", error);
    throw error;
  }
};