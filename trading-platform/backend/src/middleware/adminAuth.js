// trading-platform/backend/src/middleware/adminAuth.js
import logger from '../utils/logger.js';

/**
 * Middleware to check if user has admin role
 * Must be used AFTER authMiddleware to ensure req.user is populated
 */
export const adminOnly = (req, res, next) => {
  try {
    // Prüfe ob User überhaupt authentifiziert ist
    if (!req.user) {
      logger.warn('Admin access attempt without authentication', {
        ip: req.ip,
        url: req.originalUrl,
        method: req.method
      });
      
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Prüfe Admin-Role (anpassen je nach deinem User-Schema)
    if (req.user.role !== 'admin' && req.user.isAdmin !== true) {
      logger.warn('Non-admin user attempted admin access', {
        userId: req.user.id,
        role: req.user.role,
        ip: req.ip,
        url: req.originalUrl,
        method: req.method
      });
      
      return res.status(403).json({ 
        error: 'Admin access required. This incident has been logged.',
        code: 'ADMIN_ACCESS_REQUIRED'
      });
    }

    // Log successful admin access
    logger.info('Admin access granted', {
      userId: req.user.id,
      email: req.user.email,
      url: req.originalUrl,
      method: req.method
    });

    next();
  } catch (error) {
    logger.error('Error in admin middleware:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'MIDDLEWARE_ERROR'
    });
  }
};

/**
 * Middleware to check if user is Super Admin (falls du verschiedene Admin-Level hast)
 */
export const superAdminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    // Prüfe Super-Admin Role
    if (req.user.role !== 'superadmin' && req.user.isSuperAdmin !== true) {
      logger.warn('Non-superadmin user attempted superadmin access', {
        userId: req.user.id,
        role: req.user.role,
        ip: req.ip,
        url: req.originalUrl
      });
      
      return res.status(403).json({ 
        error: 'Super Admin access required',
        code: 'SUPER_ADMIN_ACCESS_REQUIRED'
      });
    }

    next();
  } catch (error) {
    logger.error('Error in super admin middleware:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      code: 'MIDDLEWARE_ERROR'
    });
  }
};

/**
 * Middleware um Admin-Aktionen zu loggen
 */
export const logAdminAction = (action) => {
  return (req, res, next) => {
    // Original res.json überschreiben um Erfolg zu loggen
    const originalJson = res.json;
    
    res.json = function(data) {
      // Log die Admin-Aktion
      logger.info('Admin action completed', {
        action,
        userId: req.user?.id,
        email: req.user?.email,
        url: req.originalUrl,
        method: req.method,
        success: res.statusCode < 400,
        statusCode: res.statusCode,
        body: req.body,
        timestamp: new Date().toISOString()
      });
      
      // Rufe original json auf
      return originalJson.call(this, data);
    };
    
    next();
  };
};

export default { adminOnly, superAdminOnly, logAdminAction };