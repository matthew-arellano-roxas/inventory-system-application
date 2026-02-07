import { createLogger, format, transports } from 'winston';
import { format as tzFormat } from 'date-fns-tz';

const { combine, printf, colorize, errors } = format;

// Philippine timezone
const PH_TIMEZONE = 'Asia/Manila';

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    // Use a custom timestamp in PH timezone
    format((info) => {
      info.timestamp = tzFormat(new Date(), 'yyyy-MM-dd HH:mm:ssXXX', {
        timeZone: PH_TIMEZONE,
      });
      return info;
    })(),
    errors({ stack: true }),
    logFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});
