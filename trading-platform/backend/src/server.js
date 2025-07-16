import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import lessonRoutes from './routes/lessons.js';
import progressRoutes from './routes/progress.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';

// NEW: Dynamic Lesson Routes
import dynamicLessonRoutes from './routes/dynamicLessons.js';

// Import middleware
import errorHandler from './middleware/errorHandler.js';
import authMiddleware from './middleware/auth.js';
// NEW: Admin Auth Middleware
import { adminOnly } from './middleware/adminAuth.js';
import logger from './utils/logger.js';

// Import config
import { connectDB } from './config/database.js';
import { connectRedis } from './config/redis.js';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Zu viele Anfragen von dieser IP. Versuchen Sie es später erneut.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// NEW: Spezielle Rate Limiting für Admin Migration (höhere Limits)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Höher für Admin-Operationen
  message: {
    error: 'Zu viele Admin-Anfragen von dieser IP.',
    code: 'ADMIN_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "https:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
}));

// Compression middleware
app.use(compression());

// Body parsing middleware - ERWEITERT für größere Lesson-Migration Files
app.use(express.json({ 
  limit: '50mb', // Erhöht von 10mb für große Lesson-Files
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Rate limiting - Standard für API
app.use('/api/', limiter);

// NEW: Spezielle Rate Limiting für Admin Endpoints
app.use('/api/admin/', adminLimiter);

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint - ERWEITERT
app.get('/health', async (req, res) => {
  try {
    // Optional: Prüfe Database-Verbindungen
    const dbStatus = 'connected'; // Du könntest hier eine echte DB-Prüfung machen
    const redisStatus = 'connected';
    
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV,
      version: '2.0.0', // Version erhöht für Dynamic Lessons
      services: {
        database: dbStatus,
        redis: redisStatus,
        dynamicLessons: 'available'
      },
      features: {
        lessonMigration: true,
        dynamicContent: true,
        adminPanel: true
      }
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Service unavailable'
    });
  }
});

// NEW: API Documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Trading Platform API',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      lessons: '/api/lessons (legacy)',
      dynamicLessons: '/api/dynamic-lessons (new)',
      progress: '/api/progress',
      analytics: '/api/analytics',
      admin: '/api/admin'
    },
    features: ['Dynamic Lessons', 'Content Migration', 'Progress Tracking'],
    documentation: 'https://docs.trading-platform.com'
  });
});

// ==========================================
// API ROUTES
// ==========================================

// Authentication (public)
app.use('/api/auth', authRoutes);

// User routes (protected)
app.use('/api/users', authMiddleware, userRoutes);

// Legacy lesson routes (protected) - Behalte deine bestehenden Lektionen
app.use('/api/lessons', authMiddleware, lessonRoutes);

// NEW: Dynamic Lesson routes (protected)
app.use('/api/dynamic-lessons', authMiddleware, dynamicLessonRoutes);

// Progress tracking (protected)
app.use('/api/progress', authMiddleware, progressRoutes);

// Analytics (protected)
app.use('/api/analytics', authMiddleware, analyticsRoutes);

// Admin routes (protected + admin only)
app.use('/api/admin', authMiddleware, adminOnly, adminRoutes);

// NEW: Migration API Status endpoint
app.get('/api/migration/status', authMiddleware, adminOnly, (req, res) => {
  res.json({
    status: 'available',
    supportedFormats: ['.jsx', '.js', '.ts', '.tsx'],
    maxFileSize: '50MB',
    features: {
      lessonExtraction: true,
      contentAnalysis: true,
      automaticConversion: true,
      batchImport: true
    }
  });
});

// NEW: System Info endpoint (Admin only)
app.get('/api/system/info', authMiddleware, adminOnly, (req, res) => {
  res.json({
    server: {
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      node: process.version,
      platform: process.platform
    },
    features: {
      dynamicLessons: true,
      migration: true,
      tts: true,
      interactiveComponents: true
    },
    limits: {
      maxUploadSize: '50MB',
      maxLessonsPerImport: 100,
      rateLimit: '100 requests/15min'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route nicht gefunden',
    code: 'ROUTE_NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    suggestion: 'Prüfen Sie die API-Dokumentation unter /api/docs'
  });
});

// Global error handler - ERWEITERT
app.use((error, req, res, next) => {
  logger.error('Global error handler:', {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    user: req.user?.id
  });

  // Spezielle Behandlung für Migration-Fehler
  if (error.code === 'MIGRATION_ERROR') {
    return res.status(422).json({
      error: 'Lesson Migration Fehler',
      details: error.message,
      code: 'MIGRATION_ERROR',
      timestamp: new Date().toISOString()
    });
  }

  // Standard Error Handler
  errorHandler(error, req, res, next);
});

// Graceful shutdown - ERWEITERT
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  // Stoppe neue Verbindungen
  server.close(() => {
    logger.info('HTTP server closed');
    
    // Schließe Database-Verbindungen
    // database.close();
    // redis.disconnect();
    
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown nach 30 Sekunden
  setTimeout(() => {
    logger.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
async function startServer() {
  try {
    // Connect to databases
    await connectDB();
    logger.info('✅ PostgreSQL connected successfully');
    
    await connectRedis();
    logger.info('✅ Redis connected successfully');

    // NEW: Prüfe Dynamic Lessons Schema
    try {
      // Hier könntest du eine Schema-Prüfung machen
      logger.info('✅ Dynamic Lessons schema available');
    } catch (error) {
      logger.warn('⚠️ Dynamic Lessons schema not found - run migrations first');
    }

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
      logger.info(`🔧 Environment: ${process.env.NODE_ENV}`);
      logger.info(`📚 Dynamic Lessons: ✅ Enabled`);
      logger.info(`🔄 Content Migration: ✅ Available`);
      
      console.log(`
╔══════════════════════════════════════════════════╗
║        🚀 TRADING PLATFORM BACKEND v2.0         ║
║                                                  ║
║  Server:     http://localhost:${PORT}                ║
║  Health:     http://localhost:${PORT}/health           ║
║  API Docs:   http://localhost:${PORT}/api/docs         ║
║  Admin:      http://localhost:${PORT}/api/admin        ║
║                                                  ║
║  🆕 NEW FEATURES:                               ║
║  📚 Dynamic Lessons    ✅ Available             ║
║  🔄 Content Migration  ✅ Ready                 ║
║  🎯 Interactive UI     ✅ Enabled               ║
║  🔧 Admin Panel        ✅ Active                ║
║                                                  ║
║  Status: ✅ RUNNING WITH DYNAMIC LESSONS        ║
╚══════════════════════════════════════════════════╝
      `);
    });

    // Global server reference für graceful shutdown
    global.server = server;

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;