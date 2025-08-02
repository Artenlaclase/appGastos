// src/lib/logger.ts
import pino from "pino";

// Configuración básica del logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  transport: process.env.NODE_ENV === "development" ? {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname",
    }
  } : undefined,
});

// Logger extendido con métodos específicos
export const log = {
  info: (message: string, context?: Record<string, unknown>) => logger.info(context, message),
  warn: (message: string, context?: Record<string, unknown>) => logger.warn(context, message),
  error: (message: string, context?: Record<string, unknown>) => logger.error(context, message),
  debug: (message: string, context?: Record<string, unknown>) => logger.debug(context, message),
  fatal: (message: string, context?: Record<string, unknown>) => logger.fatal(context, message),
};