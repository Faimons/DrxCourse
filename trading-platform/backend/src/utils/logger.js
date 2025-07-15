import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');

// Logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'trading-platform-backend',
    version: '1.0.0'
  },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Console output
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ]
});

// Custom logging methods
const customLogger = {
  // Standard log levels
  error: (message, meta = {}) => {
    logger.error(message, meta);
  },
  
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
  },
  
  info: (message, meta = {}) => {
    logger.info(message, meta);
  },
  
  debug: (message, meta = {}) => {
    logger.debug(message, meta);
  },
  
  // Custom methods for specific use cases
  auth: (message, meta = {}) => {
    logger.info(`[AUTH] ${message}`, meta);
  },
  
  db: (message, meta = {}) => {
    logger.debug(`[DB] ${message}`, meta);
  },
  
  api: (message, meta = {}) => {
    logger.info(`[API] ${message}`, meta);
  },
  
  security: (message, meta = {}) => {
    logger.warn(`[SECURITY] ${message}`, meta);
  },
  
  performance: (message, meta = {}) => {
    logger.info(`[PERFORMANCE] ${message}`, meta);
  },
  
  // HTTP request logging
  request: (req, res, responseTime) => {
    const { method, url, ip, headers } = req;
    const { statusCode } = res;
    
    logger.info(`${method} ${url}`, {
      ip,
      userAgent: headers['user-agent'],
      statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('content-length') || 0
    });
  },
  
  // Database query logging
  query: (query, params, duration) => {
    logger.debug('Database query executed', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      params: params?.length || 0,
      duration: `${duration}ms`
    });
  },
  
  // Error with context
  errorWithContext: (error, context = {}) => {
    logger.error(error.message, {
      stack: error.stack,
      name: error.name,
      code: error.code,
      ...context
    });
  },
  
  // Authentication events
  loginSuccess: (userId, ip) => {
    logger.info('User login successful', {
      userId,
      ip,
      event: 'LOGIN_SUCCESS'
    });
  },
  
  loginFailure: (email, ip, reason) => {
    logger.warn('User login failed', {
      email,
      ip,
      reason,
      event: 'LOGIN_FAILURE'
    });
  },
  
  // System events
  startup: (config) => {
    logger.info('Application started', {
      environment: config.environment,
      port: config.port,
      nodeVersion: process.version,
      platform: process.platform
    });
  },
  
  shutdown: (reason) => {
    logger.info('Application shutting down', {
      reason,
      uptime: process.uptime()
    });
  }
};

// Add stream for Morgan HTTP logger
customLogger.stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

export default customLogger;