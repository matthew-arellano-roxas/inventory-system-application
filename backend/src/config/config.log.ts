import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = createLogger({
  level: 'info', // default log level
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // include stack trace
    logFormat,
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // errors
    new transports.File({ filename: 'logs/combined.log' }), // all logs
  ],
});
