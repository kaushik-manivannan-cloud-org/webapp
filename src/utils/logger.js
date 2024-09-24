import path from 'path';
import { format, transports, createLogger } from 'winston';

const { combine, timestamp, errors, splat, json, simple, colorize, prettyPrint } = format;

// Define log format
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({stack: true}),
  splat(),
  json(),
  prettyPrint()
);


// Create logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // File transport
    new transports.File({
      filename: path.join('src', 'logs', 'app.log'),
      level: 'debug'
    }),
    // new transports.File({
    //   filename: path.join('logs', 'combined.log')
    // })
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