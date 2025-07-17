// trading-platform/backend/src/config/redis.js
import { createClient } from 'redis';
import logger from '../utils/logger.js';

let client = null;

// Mock Cache für Development ohne Redis
const mockCache = {
  get: async (key) => {
    return null; // Always return null (no cache)
  },
  set: async (key, value, ttl) => {
    return true; // Always return true (cache set)
  },
  del: async (key) => {
    return true; // Always return true (cache deleted)
  },
  delPattern: async (pattern) => {
    return true; // Always return true (pattern deleted)
  },
  flushall: async () => {
    return true; // Always return true (cache cleared)
  }
};

// Cache object with fallback
export const cache = {
  get: async (key) => {
    try {
      if (client && client.isOpen) {
        return await client.get(key);
      }
      return await mockCache.get(key);
    } catch (error) {
      logger.warn('Redis get error, using fallback', { key, error: error.message });
      return await mockCache.get(key);
    }
  },

  set: async (key, value, ttl = 3600) => {
    try {
      if (client && client.isOpen) {
        if (ttl) {
          return await client.setEx(key, ttl, JSON.stringify(value));
        } else {
          return await client.set(key, JSON.stringify(value));
        }
      }
      return await mockCache.set(key, value, ttl);
    } catch (error) {
      logger.warn('Redis set error, using fallback', { key, error: error.message });
      return await mockCache.set(key, value, ttl);
    }
  },

  del: async (key) => {
    try {
      if (client && client.isOpen) {
        return await client.del(key);
      }
      return await mockCache.del(key);
    } catch (error) {
      logger.warn('Redis del error, using fallback', { key, error: error.message });
      return await mockCache.del(key);
    }
  },

  delPattern: async (pattern) => {
    try {
      if (client && client.isOpen) {
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
          return await client.del(keys);
        }
        return 0;
      }
      return await mockCache.delPattern(pattern);
    } catch (error) {
      logger.warn('Redis delPattern error, using fallback', { pattern, error: error.message });
      return await mockCache.delPattern(pattern);
    }
  },

  flushall: async () => {
    try {
      if (client && client.isOpen) {
        return await client.flushAll();
      }
      return await mockCache.flushall();
    } catch (error) {
      logger.warn('Redis flushall error, using fallback', { error: error.message });
      return await mockCache.flushall();
    }
  }
};

// Connect to Redis
export async function connectRedis() {
  try {
    // Skip Redis connection if no URL provided
    if (!process.env.REDIS_URL) {
      logger.info('ℹ️ Redis URL not configured, using memory cache fallback');
      return true;
    }

    // Create Redis client
    client = createClient({
      url: process.env.REDIS_URL,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          logger.error('Redis connection refused');
          return 5000; // Retry after 5 seconds
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          logger.error('Redis retry time exhausted');
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          logger.error('Redis retry attempts exhausted');
          return new Error('Retry attempts exhausted');
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    // Error handling
    client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    client.on('disconnect', () => {
      logger.warn('⚠️ Redis disconnected');
    });

    // Connect to Redis
    await client.connect();
    
    return true;
  } catch (error) {
    logger.error('Redis connection failed:', error.message);
    logger.info('🔄 Using memory cache fallback');
    return true; // Return true to not break the app
  }
}

// Disconnect from Redis
export async function disconnectRedis() {
  try {
    if (client && client.isOpen) {
      await client.disconnect();
      logger.info('Redis disconnected');
    }
  } catch (error) {
    logger.error('Redis disconnect error:', error.message);
  }
}

export default { connectRedis, disconnectRedis, cache };