import winston from 'winston';
import 'winston-daily-rotate-file'; // Import the daily rotate file transport

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    // new winston.transports.Console(), // Log to console
    new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});
