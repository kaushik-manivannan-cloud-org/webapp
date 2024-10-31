import path from 'path';
import { format, transports, createLogger } from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const { combine, timestamp, errors, splat, json, simple, colorize, prettyPrint } = format;

// Define different formats for production and development
const productionFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  json()
);

const developmentFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  json(),
  prettyPrint()
);

// Determine log path based on environment
const logFilePath = process.env.NODE_ENV === 'production'
  ? path.join('/tmp', 'logs', 'app.log')  // Production log path
  : path.join('src', 'logs', 'app.log');  // Development log path

// Create logger
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: process.env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  transports: [
    // File transport
    new transports.File({
      filename: logFilePath,
      level: level,
      handleExceptions: true
    })
  ]
});

// If we're not in production, log to the console with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      simple()
    )
  }));
}

export default logger;