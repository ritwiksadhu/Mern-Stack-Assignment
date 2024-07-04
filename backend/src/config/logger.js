import winston from "winston";

const { combine, timestamp, printf, colorize, simple } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  const stackInfo = stack ? ` - ${stack}` : "";
  return `${timestamp} [${level}]${stackInfo}: ${message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), colorize(), simple(), customFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

// Define a stream object with a 'write' function for morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export const logError = (message) => {
  const stack = new Error().stack.split("\n")[2].trim();
  logger.error(message, { stack });
};

export const logInfo = (message) => {
  const stack = new Error().stack.split("\n")[2].trim();
  logger.info(message, { stack });
};

export default logger;
