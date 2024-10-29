import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger.js";

const s3Client = new S3Client({ region: process.env.AWS_REGION });

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
