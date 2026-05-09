import winston from "winston";

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/** Single Console transport instance for normal logging */
const primaryConsole = new winston.transports.Console({
  stderrLevels: ["error"],
});

/** Separate Console instances avoid sharing one transport across exception/rejection hooks */
function exceptionConsole(): winston.transports.ConsoleTransportInstance {
  return new winston.transports.Console({
    stderrLevels: ["error"],
    format: jsonFormat,
  });
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL ?? "info",
  format: jsonFormat,
  exitOnError: false,
  transports: [primaryConsole],
  exceptionHandlers: [exceptionConsole()],
  rejectionHandlers: [exceptionConsole()],
});

/** Security / policy events (warnings, anomalies) */
export function securityLog(message: string, meta: Record<string, unknown> = {}) {
  logger.warn(message, { eventType: "security", ...meta });
}

/** Route-handler or API failures worth correlating */
export function apiErrorLog(route: string, meta: Record<string, unknown> = {}) {
  logger.error("api.route_error", {
    component: "api",
    route,
    ...meta,
  });
}

export default logger;
