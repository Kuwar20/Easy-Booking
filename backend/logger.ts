import { createLogger, format, transports, Logger } from 'winston';

const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
    format.colorize(),
    format.printf(({ level, message, timestamp }: { level: string; message: string; timestamp?: string }) => {
        return `${level}: ${message}`;
    })
);

// Create a Winston logger
const logger: Logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp(),
        json()
    ),
    transports: [
        new transports.Console({
            format: consoleLogFormat
        }),
        new transports.File({ filename: 'app.log' })
    ],
});

export default logger;