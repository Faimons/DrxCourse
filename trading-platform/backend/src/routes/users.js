// trading-platform/backend/src/routes/users.js
import express from 'express';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT 
        u.id, u.name, u.email, u.role, u.status, u.avatar_url,
        u.timezone, u.preferences, u.email_verified, u.last_login,
        u.created_at, u.updated_at,
        up.total_lessons, up.completed_lessons, up.current_streak,
        up.longest_streak, up.total_time_spent, up.average_quiz_score
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.id = $1
    `, [req.user.userId]);

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
        timezone: user.timezone,
        preferences: user.preferences || { theme: 'dark', notifications: true, language: 'en' },
        email_verified: user.email_verified,
        last_login: user.last_login,
        created_at: user.created_at,
        updated_at: user.updated_at,
        progress: {
          total_lessons: user.total_lessons || 0,
          completed_lessons: user.completed_lessons || 0,
          current_streak: user.current_streak || 0,
          longest_streak: user.longest_streak || 0,
          total_time_spent: user.total_time_spent || 0,
          average_quiz_score: user.average_quiz_score || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', async (req, res, next) => {
  try {
    const { name, timezone, avatar_url } = req.body;
    
    const result = await query(`
      UPDATE users 
      SET name = COALESCE($1, name),
          timezone = COALESCE($2, timezone),
          avatar_url = COALESCE($3, avatar_url),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, name, email, role, avatar_url, timezone, updated_at
    `, [name, timezone, avatar_url, req.user.userId]);

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', async (req, res, next) => {
  try {
    const { preferences } = req.body;
    
    const result = await query(`
      UPDATE users 
      SET preferences = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING preferences
    `, [JSON.stringify(preferences), req.user.userId]);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: result.rows[0].preferences
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/users/password
// @desc    Update password
// @access  Private
router.put('/password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }
    
    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    // Get current password hash
    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(`
      UPDATE users 
      SET password_hash = $1, updated_at = NOW()
      WHERE id = $2
    `, [hashedNewPassword, req.user.userId]);

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;