// trading-platform/backend/src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, newsletter = false } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }
    
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    // Check if user exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new AppError('User already exists with this email', 409);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await query(`
      INSERT INTO users (name, email, password_hash, role, status, email_verified, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
      RETURNING id, name, email, role, status, email_verified, created_at
    `, [name, email, hashedPassword, 'student', 'active', false]);

    const user = result.rows[0];

    // Initialize user progress
    await query(`
      INSERT INTO user_progress (user_id, total_lessons, completed_lessons, created_at, updated_at)
      VALUES ($1, 0, 0, NOW(), NOW())
    `, [user.id]);

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '24h' }
    );

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        email_verified: user.email_verified,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Check if user exists
    const result = await query(
      'SELECT id, name, email, password_hash, role, status, email_verified, last_login FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid credentials', 401);
    }

    const user = result.rows[0];

    // Check if user is active
    if (user.status !== 'active') {
      throw new AppError('Account is inactive. Please contact support.', 403);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '24h' }
    );

    logger.info('User login successful', { userId: user.id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        email_verified: user.email_verified,
        last_login: user.last_login
      },
      token
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Get user from database
    const result = await query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.status, u.avatar_url, 
        u.email_verified, u.last_login, u.created_at, u.updated_at,
        u.preferences,
        up.total_lessons, up.completed_lessons, up.current_streak, 
        up.longest_streak, up.total_time_spent
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.id = $1 AND u.status = 'active'
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
        preferences: user.preferences || {
          theme: 'dark',
          notifications: true,
          language: 'en'
        },
        progress: {
          total_lessons: user.total_lessons || 0,
          completed_lessons: user.completed_lessons || 0,
          current_streak: user.current_streak || 0,
          longest_streak: user.longest_streak || 0,
          total_time_spent: user.total_time_spent || 0
        }
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  // Since we're using stateless JWT, logout is handled client-side
  // In a production app, you might want to blacklist tokens
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Generate new access token
    const accessToken = jwt.sign(
      { 
        userId: decoded.userId, 
        email: decoded.email, 
        role: decoded.role 
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      accessToken
    });
  } catch (error) {
    next(new AppError('Invalid refresh token', 401));
  }
});

export default router;