import express from 'express';
import { query, withTransaction } from '../config/database.js';
import { cache } from '../config/redis.js';
import { AppError, asyncHandler, sendSuccess, sendError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/progress - Get user's overall progress
router.get('/', asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Check cache first
    const cacheKey = `user:${userId}:progress`;
    const cachedProgress = await cache.get(cacheKey);
    
    if (cachedProgress) {
      return sendSuccess(res, cachedProgress, 'Fortschritt aus Cache geladen');
    }

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
      LEFT JOIN quiz_attempts qa ON l.id = qa.lesson_id AND qa.user_id = $1 AND qa.id = (
        SELECT id FROM quiz_attempts qa2 
        WHERE qa2.user_id = $1 AND qa2.lesson_id = l.id 
        ORDER BY qa2.created_at DESC LIMIT 1
      )
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

    // Get current learning streak details
    const streakResult = await query(`
      WITH daily_activity AS (
        SELECT DISTINCT DATE(completed_at) as activity_date
        FROM lesson_progress
        WHERE user_id = $1 AND completed_at IS NOT NULL
        ORDER BY activity_date DESC
      ),
      streak_data AS (
        SELECT 
          activity_date,
          activity_date - (ROW_NUMBER() OVER (ORDER BY activity_date DESC))::integer as streak_group
        FROM daily_activity
      )
      SELECT COUNT(*) as current_streak
      FROM streak_data
      WHERE streak_group = (
        SELECT streak_group 
        FROM streak_data 
        WHERE activity_date = CURRENT_DATE
        LIMIT 1
      )
    `, [userId]);

    // Get achievements
    const achievementsResult = await query(`
      SELECT 
        a.id, a.name, a.description, a.icon, a.criteria,
        ua.earned_at
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
      ORDER BY ua.earned_at DESC
    `, [userId]);

    // Get study calendar (last 30 days)
    const calendarResult = await query(`
      SELECT 
        DATE(lp.completed_at) as date,
        COUNT(*) as lessons_completed,
        SUM(lp.time_spent) as minutes_studied
      FROM lesson_progress lp
      WHERE lp.user_id = $1 
        AND lp.completed_at >= NOW() - INTERVAL '30 days'
        AND lp.completed_at IS NOT NULL
      GROUP BY DATE(lp.completed_at)
      ORDER BY date
    `, [userId]);

    const progress = progressResult.rows[0] || {
      total_lessons: 0,
      completed_lessons: 0,
      total_time_spent: 0,
      current_streak: 0,
      longest_streak: 0,
      last_activity: null,
      average_quiz_score: 0,
      total_quiz_attempts: 0
    };

    const currentStreak = streakResult.rows[0]?.current_streak || 0;

    const progressData = {
      overview: {
        totalLessons: progress.total_lessons || 0,
        completedLessons: progress.completed_lessons || 0,
        completionRate: progress.total_lessons ? 
          Math.round((progress.completed_lessons / progress.total_lessons) * 100) : 0,
        totalTimeSpent: progress.total_time_spent || 0,
        averageTimePerLesson: progress.completed_lessons ? 
          Math.round(progress.total_time_spent / progress.completed_lessons) : 0,
        startDate: progress.start_date,
        lastActivity: progress.last_activity
      },
      streaks: {
        current: currentStreak,
        longest: progress.longest_streak || 0,
        isActiveToday: recentActivityResult.rows.some(
          activity => activity.date === new Date().toISOString().split('T')[0]
        )
      },
      quiz: {
        averageScore: Math.round(progress.average_quiz_score || 0),
        totalAttempts: progress.total_quiz_attempts || 0,
        passRate: 0 // Will be calculated separately if needed
      },
      categories: categoryProgressResult.rows.map(cat => ({
        name: cat.category,
        totalLessons: parseInt(cat.total_lessons),
        completedLessons: parseInt(cat.completed_lessons),
        completionRate: cat.total_lessons ? 
          Math.round((cat.completed_lessons / cat.total_lessons) * 100) : 0,
        totalTime: parseInt(cat.total_time),
        averageQuizScore: Math.round(cat.avg_quiz_score || 0)
      })),
      recentActivity: recentActivityResult.rows,
      achievements: achievementsResult.rows,
      studyCalendar: calendarResult.rows.map(day => ({
        date: day.date,
        lessonsCompleted: parseInt(day.lessons_completed),
        minutesStudied: parseInt(day.minutes_studied)
      }))
    };

    // Cache for 5 minutes
    await cache.set(cacheKey, progressData, 300);

    sendSuccess(res, progressData);

  } catch (error) {
    logger.errorWithContext(error, { userId: req.user.id });
    throw new AppError('Fortschritt konnte nicht geladen werden', 500, 'PROGRESS_LOAD_ERROR');
  }
}));

// GET /api/progress/lessons - Get detailed lesson progress
router.get('/lessons', asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, completed, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE l.status = $1';
    const params = ['published'];
    let paramCount = 1;

    if (category) {
      paramCount++;
      whereClause += ` AND l.category = $${paramCount}`;
      params.push(category);
    }

    if (completed !== undefined) {
      if (completed === 'true') {
        whereClause += ` AND lp.completed_at IS NOT NULL`;
      } else {
        whereClause += ` AND lp.completed_at IS NULL`;
      }
    }

    const lessonsResult = await query(`
      SELECT 
        l.id, l.title, l.category, l.difficulty, l.duration_minutes,
        l.order_index, l.thumbnail_url,
        lp.progress_percentage, lp.time_spent, lp.completed_at,
        lp.last_accessed_at, lp.notes, lp.current_slide,
        qa.percentage as quiz_score, qa.passed as quiz_passed,
        qa.attempt_number as quiz_attempts
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $${paramCount + 1}
      LEFT JOIN LATERAL (
        SELECT percentage, passed, attempt_number
        FROM quiz_attempts qa
        WHERE qa.user_id = $${paramCount + 1} AND qa.lesson_id = l.id
        ORDER BY qa.created_at DESC
        LIMIT 1
      ) qa ON true
      ${whereClause}
      ORDER BY l.category, l.order_index
      LIMIT $${paramCount + 2} OFFSET $${paramCount + 3}
    `, [...params, userId, limit, offset]);

    // Get total count
    const countResult = await query(`
      SELECT COUNT(*)
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $${paramCount + 1}
      ${whereClause}
    `, [...params, userId]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    const lessons = lessonsResult.rows.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      duration: lesson.duration_minutes,
      order: lesson.order_index,
      thumbnail: lesson.thumbnail_url,
      progress: {
        percentage: lesson.progress_percentage || 0,
        timeSpent: lesson.time_spent || 0,
        completedAt: lesson.completed_at,
        lastAccessed: lesson.last_accessed_at,
        notes: lesson.notes,
        currentSlide: lesson.current_slide
      },
      quiz: {
        score: lesson.quiz_score,
        passed: lesson.quiz_passed,
        attempts: lesson.quiz_attempts || 0
      }
    }));

    sendSuccess(res, {
      lessons,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    logger.errorWithContext(error, { userId: req.user.id, query: req.query });
    throw new AppError('Lektionsfortschritt konnte nicht geladen werden', 500, 'LESSON_PROGRESS_LOAD_ERROR');
  }
}));

// GET /api/progress/stats - Get learning statistics
router.get('/stats', asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query; // days

    // Study time distribution
    const timeDistributionResult = await query(`
      SELECT 
        EXTRACT(hour FROM lp.completed_at) as hour,
        COUNT(*) as sessions,
        SUM(lp.time_spent) as total_time
      FROM lesson_progress lp
      WHERE lp.user_id = $1 
        AND lp.completed_at >= NOW() - INTERVAL '${period} days'
        AND lp.completed_at IS NOT NULL
      GROUP BY EXTRACT(hour FROM lp.completed_at)
      ORDER BY hour
    `, [userId]);

    // Daily study pattern
    const dailyPatternResult = await query(`
      SELECT 
        EXTRACT(dow FROM lp.completed_at) as day_of_week,
        COUNT(*) as sessions,
        AVG(lp.time_spent) as avg_time
      FROM lesson_progress lp
      WHERE lp.user_id = $1 
        AND lp.completed_at >= NOW() - INTERVAL '${period} days'
        AND lp.completed_at IS NOT NULL
      GROUP BY EXTRACT(dow FROM lp.completed_at)
      ORDER BY day_of_week
    `, [userId]);

    // Learning velocity (lessons per day trend)
    const velocityResult = await query(`
      SELECT 
        DATE(lp.completed_at) as date,
        COUNT(*) as lessons_completed
      FROM lesson_progress lp
      WHERE lp.user_id = $1 
        AND lp.completed_at >= NOW() - INTERVAL '${period} days'
        AND lp.completed_at IS NOT NULL
      GROUP BY DATE(lp.completed_at)
      ORDER BY date
    `, [userId]);

    // Quiz performance trend
    const quizTrendResult = await query(`
      SELECT 
        DATE(qa.created_at) as date,
        AVG(qa.percentage) as avg_score,
        COUNT(*) as attempts,
        COUNT(CASE WHEN qa.passed THEN 1 END) as passed
      FROM quiz_attempts qa
      WHERE qa.user_id = $1 
        AND qa.created_at >= NOW() - INTERVAL '${period} days'
      GROUP BY DATE(qa.created_at)
      ORDER BY date
    `, [userId]);

    // Difficulty preference
    const difficultyResult = await query(`
      SELECT 
        l.difficulty,
        COUNT(*) as completed_count,
        AVG(lp.time_spent) as avg_time,
        AVG(qa.percentage) as avg_quiz_score
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      LEFT JOIN quiz_attempts qa ON lp.lesson_id = qa.lesson_id AND lp.user_id = qa.user_id
      WHERE lp.user_id = $1 
        AND lp.completed_at >= NOW() - INTERVAL '${period} days'
        AND lp.completed_at IS NOT NULL
      GROUP BY l.difficulty
      ORDER BY completed_count DESC
    `, [userId]);

    const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

    sendSuccess(res, {
      timeDistribution: timeDistributionResult.rows.map(row => ({
        hour: parseInt(row.hour),
        sessions: parseInt(row.sessions),
        totalTime: parseInt(row.total_time)
      })),
      dailyPattern: dailyPatternResult.rows.map(row => ({
        dayOfWeek: parseInt(row.day_of_week),
        dayName: dayNames[parseInt(row.day_of_week)],
        sessions: parseInt(row.sessions),
        averageTime: Math.round(row.avg_time)
      })),
      learningVelocity: velocityResult.rows.map(row => ({
        date: row.date,
        lessonsCompleted: parseInt(row.lessons_completed)
      })),
      quizTrend: quizTrendResult.rows.map(row => ({
        date: row.date,
        averageScore: Math.round(row.avg_score),
        attempts: parseInt(row.attempts),
        passRate: Math.round((row.passed / row.attempts) * 100)
      })),
      difficultyPreference: difficultyResult.rows.map(row => ({
        difficulty: row.difficulty,
        completedCount: parseInt(row.completed_count),
        averageTime: Math.round(row.avg_time),
        averageQuizScore: Math.round(row.avg_quiz_score || 0)
      }))
    });

  } catch (error) {
    logger.errorWithContext(error, { userId: req.user.id, query: req.query });
    throw new AppError('Lernstatistiken konnten nicht geladen werden', 500, 'STATS_LOAD_ERROR');
  }
}));

// GET /api/progress/achievements - Get user achievements
router.get('/achievements', asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all achievements with user's progress
    const achievementsResult = await query(`
      SELECT 
        a.id, a.name, a.description, a.icon, a.criteria,
        a.threshold, a.category, a.points,
        ua.earned_at,
        CASE 
          WHEN a.criteria = 'lessons_completed' THEN up.completed_lessons
          WHEN a.criteria = 'streak_days' THEN up.current_streak
          WHEN a.criteria = 'study_time' THEN up.total_time_spent
          WHEN a.criteria = 'quiz_average' THEN up.average_quiz_score
          ELSE 0
        END as current_progress
      FROM achievements a
      LEFT JOIN user_achievements ua ON a.id = ua.achievement_id AND ua.user_id = $1
      LEFT JOIN user_progress up ON up.user_id = $1
      ORDER BY 
        CASE WHEN ua.earned_at IS NOT NULL THEN 0 ELSE 1 END,
        ua.earned_at DESC,
        a.points ASC
    `, [userId]);

    // Get user's total achievement points
    const pointsResult = await query(`
      SELECT COALESCE(SUM(a.points), 0) as total_points
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = $1
    `, [userId]);

    const achievements = achievementsResult.rows.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      icon: achievement.icon,
      criteria: achievement.criteria,
      threshold: achievement.threshold,
      category: achievement.category,
      points: achievement.points,
      isEarned: !!achievement.earned_at,
      earnedAt: achievement.earned_at,
      currentProgress: achievement.current_progress || 0,
      progressPercentage: achievement.threshold ? 
        Math.min(100, Math.round((achievement.current_progress / achievement.threshold) * 100)) : 0
    }));

    // Group by category
    const achievementsByCategory = achievements.reduce((acc, achievement) => {
      if (!acc[achievement.category]) {
        acc[achievement.category] = [];
      }
      acc[achievement.category].push(achievement);
      return acc;
    }, {});

    sendSuccess(res, {
      totalPoints: parseInt(pointsResult.rows[0].total_points),
      totalAchievements: achievements.length,
      earnedAchievements: achievements.filter(a => a.isEarned).length,
      achievements: achievementsByCategory,
      recentlyEarned: achievements
        .filter(a => a.isEarned && a.earnedAt)
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, 5)
    });

  } catch (error) {
    logger.errorWithContext(error, { userId: req.user.id });
    throw new AppError('Erfolge konnten nicht geladen werden', 500, 'ACHIEVEMENTS_LOAD_ERROR');
  }
}));

// POST /api/progress/notes/:lessonId - Update lesson notes
router.post('/notes/:lessonId', asyncHandler(async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const userId = req.user.id;
    const { notes } = req.body;

    if (isNaN(lessonId)) {
      return sendError(res, 'Ungültige Lektions-ID', 400, 'INVALID_LESSON_ID');
    }

    const result = await query(`
      INSERT INTO lesson_progress (user_id, lesson_id, notes, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET 
        notes = EXCLUDED.notes,
        last_accessed_at = NOW()
      RETURNING notes
    `, [userId, lessonId, notes]);

    // Invalidate caches
    await Promise.all([
      cache.delPattern(`lesson:${lessonId}:${userId}`),
      cache.delPattern(`user:${userId}:progress`)
    ]);

    logger.info('Lesson notes updated', { userId, lessonId });

    sendSuccess(res, {
      notes: result.rows[0].notes
    }, 'Notizen gespeichert');

  } catch (error) {
    logger.errorWithContext(error, {
      userId: req.user.id,
      lessonId: req.params.lessonId
    });
    throw new AppError('Notizen konnten nicht gespeichert werden', 500, 'NOTES_UPDATE_ERROR');
  }
}));

// GET /api/progress/recommendations - Get personalized learning recommendations
router.get('/recommendations', asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's learning patterns
    const patternsResult = await query(`
      SELECT 
        l.category,
        l.difficulty,
        COUNT(*) as completed_count,
        AVG(lp.time_spent) as avg_time,
        AVG(qa.percentage) as avg_quiz_score
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.id
      LEFT JOIN quiz_attempts qa ON lp.lesson_id = qa.lesson_id AND lp.user_id = qa.user_id
      WHERE lp.user_id = $1 AND lp.completed_at IS NOT NULL
      GROUP BY l.category, l.difficulty
      ORDER BY completed_count DESC, avg_quiz_score DESC
    `, [userId]);

    // Get incomplete lessons in user's preferred categories
    const recommendationsResult = await query(`
      SELECT 
        l.id, l.title, l.description, l.category, l.difficulty,
        l.duration_minutes, l.thumbnail_url,
        CASE 
          WHEN lp.progress_percentage IS NULL THEN 0
          ELSE lp.progress_percentage
        END as current_progress
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
      WHERE l.status = 'published' 
        AND (lp.completed_at IS NULL OR lp.completed_at IS NULL)
      ORDER BY 
        CASE WHEN l.category IN (
          SELECT category FROM lesson_progress lp2 
          JOIN lessons l2 ON lp2.lesson_id = l2.id 
          WHERE lp2.user_id = $1 
          GROUP BY category 
          ORDER BY COUNT(*) DESC 
          LIMIT 3
        ) THEN 0 ELSE 1 END,
        l.order_index
      LIMIT 10
    `, [userId]);

    // Get review recommendations (lessons with low quiz scores)
    const reviewResult = await query(`
      SELECT 
        l.id, l.title, l.category, l.difficulty,
        qa.percentage as quiz_score,
        qa.created_at as last_attempt
      FROM lessons l
      JOIN quiz_attempts qa ON l.id = qa.lesson_id
      WHERE qa.user_id = $1 
        AND qa.percentage < 80
        AND qa.id = (
          SELECT id FROM quiz_attempts qa2
          WHERE qa2.user_id = $1 AND qa2.lesson_id = l.id
          ORDER BY qa2.created_at DESC
          LIMIT 1
        )
      ORDER BY qa.percentage ASC, qa.created_at DESC
      LIMIT 5
    `, [userId]);

    const userPatterns = patternsResult.rows[0] || {};
    const preferredDifficulty = userPatterns.difficulty || 'beginner';
    const strongCategories = patternsResult.rows.slice(0, 3).map(p => p.category);

    sendSuccess(res, {
      nextLessons: recommendationsResult.rows.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        difficulty: lesson.difficulty,
        duration: lesson.duration_minutes,
        thumbnail: lesson.thumbnail_url,
        currentProgress: lesson.current_progress,
        reason: strongCategories.includes(lesson.category) ? 
          'Basierend auf Ihren bevorzugten Themen' : 
          'Empfohlen für Ihren Lernfortschritt'
      })),
      reviewLessons: reviewResult.rows.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty,
        quizScore: lesson.quiz_score,
        lastAttempt: lesson.last_attempt,
        reason: 'Quiz-Ergebnis unter 80% - Wiederholung empfohlen'
      })),
      insights: {
        preferredDifficulty,
        strongCategories,
        weeklyGoal: 5, // Could be retrieved from user preferences
        recommendedStudyTime: Math.max(15, userPatterns.avg_time || 20)
      }
    });

  } catch (error) {
    logger.errorWithContext(error, { userId: req.user.id });
    throw new AppError('Empfehlungen konnten nicht geladen werden', 500, 'RECOMMENDATIONS_LOAD_ERROR');
  }
}));

export default router;