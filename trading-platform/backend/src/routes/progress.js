// trading-platform/backend/src/routes/progress.js
import express from 'express';
import { query } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

// @route   GET /api/progress
// @desc    Get user's overall progress
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get overall progress
    const progressResult = await query(`
      SELECT 
        up.total_lessons, up.completed_lessons, up.total_time_spent,
        up.current_streak, up.longest_streak, up.last_activity,
        up.average_quiz_score, up.total_quiz_attempts,
        u.created_at as start_date
      FROM user_progress up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = $1
    `, [userId]);

    // Get progress by category
    const categoryProgressResult = await query(`
      SELECT 
        l.category,
        COUNT(l.id) as total_lessons,
        COUNT(lp.id) as completed_lessons,
        COALESCE(SUM(lp.time_spent), 0) as total_time,
        COALESCE(AVG(CASE WHEN qa.passed THEN qa.percentage END), 0) as avg_quiz_score
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1 AND lp.completed_at IS NOT NULL
      LEFT JOIN quiz_attempts qa ON l.id = qa.lesson_id AND qa.user_id = $1
      WHERE l.status = 'published'
      GROUP BY l.category
      ORDER BY l.category
    `, [userId]);

    // Get recent activity (last 7 days)
    const recentActivityResult = await query(`
      SELECT 
        DATE(lp.completed_at) as date,
        COUNT(*) as lessons_completed,
        SUM(lp.time_spent) as time_spent
      FROM lesson_progress lp
      WHERE lp.user_id = $1 
        AND lp.completed_at >= NOW() - INTERVAL '7 days'
        AND lp.completed_at IS NOT NULL
      GROUP BY DATE(lp.completed_at)
      ORDER BY date DESC
    `, [userId]);

    const progressData = progressResult.rows[0] || {
      total_lessons: 0,
      completed_lessons: 0,
      total_time_spent: 0,
      current_streak: 0,
      longest_streak: 0,
      average_quiz_score: 0,
      total_quiz_attempts: 0
    };

    res.json({
      success: true,
      data: {
        overall: progressData,
        byCategory: categoryProgressResult.rows,
        recentActivity: recentActivityResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/progress/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get all achievements with user progress
    const achievementsResult = await query(`
      SELECT 
        a.id, a.name, a.description, a.icon, a.criteria, a.threshold,
        a.category, a.points,
        ua.earned_at,
        CASE 
          WHEN ua.earned_at IS NOT NULL THEN true 
          ELSE false 
        END as is_earned
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      ORDER BY a.category, a.threshold
    `, [userId]);

    // Get total points
    const pointsResult = await query(`
      SELECT COALESCE(SUM(a.points), 0) as total_points
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
    `, [userId]);

    const achievements = achievementsResult.rows;
    const earnedCount = achievements.filter(a => a.is_earned).length;

    // Group by category
    const achievementsByCategory = achievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        totalPoints: parseInt(pointsResult.rows[0].total_points),
        totalAchievements: achievements.length,
        earnedAchievements: earnedCount,
        achievements: achievementsByCategory,
        recentlyEarned: achievements
          .filter(a => a.is_earned && a.earned_at)
          .sort((a, b) => new Date(b.earned_at) - new Date(a.earned_at))
          .slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/progress/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/dashboard', async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // User basic info with progress
    const userResult = await query(`
      SELECT 
        u.id, u.name, u.email, u.created_at,
        up.total_lessons, up.completed_lessons, up.current_streak,
        up.total_time_spent, up.average_quiz_score
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.id = $1
    `, [userId]);

    // Recent lessons
    const recentLessonsResult = await query(`
      SELECT 
        l.id, l.title, l.category, l.difficulty, l.duration_minutes,
        lp.progress_percentage, lp.last_accessed_at, lp.completed_at
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
      WHERE l.status = 'published'
      ORDER BY lp.last_accessed_at DESC NULLS LAST, l.created_at DESC
      LIMIT 5
    `, [userId]);

    // Recent achievements
    const recentAchievementsResult = await query(`
      SELECT 
        a.name, a.description, a.icon, a.points,
        ua.earned_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
      ORDER BY ua.earned_at DESC
      LIMIT 3
    `, [userId]);

    const user = userResult.rows[0];
    const completionPercentage = user.total_lessons > 0 
      ? Math.round((user.completed_lessons / user.total_lessons) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          completion_percentage: completionPercentage
        },
        recentLessons: recentLessonsResult.rows,
        recentAchievements: recentAchievementsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;