// trading-platform/backend/src/routes/dynamicLessons.js
import express from 'express';
import { lessonController } from '../controllers/lessonController.js';
import { adminOnly } from '../middleware/adminAuth.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ==========================================
// PUBLIC DYNAMIC LESSON ROUTES
// ==========================================

// GET /api/dynamic-lessons - Alle Dynamic Lektionen
router.get('/', async (req, res) => {
  try {
    await lessonController.getAllLessons(req, res);
  } catch (error) {
    logger.error('Error in GET /dynamic-lessons:', error);
    res.status(500).json({ error: 'Failed to fetch dynamic lessons' });
  }
});

// GET /api/dynamic-lessons/:id - Spezifische Dynamic Lektion
router.get('/:id', async (req, res) => {
  try {
    await lessonController.getLessonById(req, res);
  } catch (error) {
    logger.error(`Error in GET /dynamic-lessons/${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// GET /api/dynamic-lessons/:id/metadata - Nur Lesson Metadata
router.get('/:id/metadata', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [lessonResult] = await pool.execute(`
      SELECT id, title, subtitle, module, difficulty, estimated_time, objectives, 
             created_at, updated_at,
             (SELECT COUNT(*) FROM dynamic_slides WHERE lesson_id = ?) as slide_count
      FROM dynamic_lessons 
      WHERE id = ? AND is_active = true
    `, [id, id]);

    if (lessonResult.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lesson = lessonResult[0];
    if (lesson.objectives) lesson.objectives = JSON.parse(lesson.objectives);

    res.json(lesson);
  } catch (error) {
    logger.error(`Error in GET /dynamic-lessons/${req.params.id}/metadata:`, error);
    res.status(500).json({ error: 'Failed to fetch lesson metadata' });
  }
});

// ==========================================
// USER PROGRESS ROUTES
// ==========================================

// POST /api/dynamic-lessons/:id/progress - Update User Progress
router.post('/:id/progress', async (req, res) => {
  try {
    await lessonController.updateProgress(req, res);
  } catch (error) {
    logger.error(`Error in POST /dynamic-lessons/${req.params.id}/progress:`, error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// GET /api/dynamic-lessons/:id/progress - Get User Progress
router.get('/:id/progress', async (req, res) => {
  try {
    // Verwende aktuelle User ID aus req.user
    req.params.userId = req.user.id;
    await lessonController.getLessonProgress(req, res);
  } catch (error) {
    logger.error(`Error in GET /dynamic-lessons/${req.params.id}/progress:`, error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// GET /api/dynamic-lessons/user/overview - User's Lesson Overview
router.get('/user/overview', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [lessons] = await pool.execute(`
      SELECT 
        l.id, l.title, l.subtitle, l.difficulty, l.estimated_time,
        COUNT(s.id) as total_slides,
        COUNT(p.slide_id) as completed_slides,
        COUNT(CASE WHEN p.completed_at IS NOT NULL THEN 1 END) as finished_slides,
        MAX(p.updated_at) as last_activity
      FROM dynamic_lessons l
      LEFT JOIN dynamic_slides s ON l.id = s.lesson_id
      LEFT JOIN dynamic_lesson_progress p ON l.id = p.lesson_id AND p.user_id = ?
      WHERE l.is_active = true
      GROUP BY l.id
      ORDER BY last_activity DESC, l.created_at DESC
    `, [userId]);

    const overview = lessons.map(lesson => ({
      ...lesson,
      progress_percentage: lesson.total_slides > 0 
        ? Math.round((lesson.finished_slides / lesson.total_slides) * 100) 
        : 0,
      status: lesson.finished_slides === lesson.total_slides ? 'completed' :
              lesson.finished_slides > 0 ? 'in_progress' : 'not_started'
    }));

    res.json(overview);
  } catch (error) {
    logger.error('Error in GET /dynamic-lessons/user/overview:', error);
    res.status(500).json({ error: 'Failed to fetch user lesson overview' });
  }
});

// ==========================================
// ADMIN-ONLY ROUTES
// ==========================================

// POST /api/dynamic-lessons/import - Import Lesson (Admin only)
router.post('/import', adminOnly, async (req, res) => {
  try {
    await lessonController.importLesson(req, res);
  } catch (error) {
    logger.error('Error in POST /dynamic-lessons/import:', error);
    
    // Spezielle Migration Error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        error: 'Lesson already exists',
        code: 'DUPLICATE_LESSON' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to import lesson',
      code: 'MIGRATION_ERROR'
    });
  }
});

// POST /api/dynamic-lessons/import/batch - Batch Import (Admin only)
router.post('/import/batch', adminOnly, async (req, res) => {
  try {
    const { lessons } = req.body;
    
    if (!Array.isArray(lessons) || lessons.length === 0) {
      return res.status(400).json({ error: 'Invalid lessons array' });
    }

    const results = {
      successful: [],
      failed: []
    };

    for (const lesson of lessons) {
      try {
        // Simuliere einzelnen Import
        req.body = { lesson };
        await lessonController.importLesson(req, res);
        results.successful.push(lesson.id);
      } catch (error) {
        results.failed.push({
          id: lesson.id,
          error: error.message
        });
      }
    }

    logger.info(`Batch import completed: ${results.successful.length} successful, ${results.failed.length} failed`);
    
    res.json(results);
  } catch (error) {
    logger.error('Error in POST /dynamic-lessons/import/batch:', error);
    res.status(500).json({ error: 'Batch import failed' });
  }
});

// DELETE /api/dynamic-lessons/:id - Delete Lesson (Admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await lessonController.deleteLesson(req, res);
  } catch (error) {
    logger.error(`Error in DELETE /dynamic-lessons/${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// GET /api/dynamic-lessons/admin/stats - Admin Statistics
router.get('/admin/stats', adminOnly, async (req, res) => {
  try {
    const [stats] = await pool.execute(`
      SELECT 
        COUNT(DISTINCT l.id) as total_lessons,
        COUNT(DISTINCT s.id) as total_slides,
        COUNT(DISTINCT p.user_id) as active_users,
        AVG(l.estimated_time) as avg_lesson_duration,
        COUNT(CASE WHEN l.difficulty = 'Beginner' THEN 1 END) as beginner_lessons,
        COUNT(CASE WHEN l.difficulty = 'Intermediate' THEN 1 END) as intermediate_lessons,
        COUNT(CASE WHEN l.difficulty = 'Advanced' THEN 1 END) as advanced_lessons,
        COUNT(CASE WHEN s.type = 'quiz' THEN 1 END) as quiz_slides,
        COUNT(CASE WHEN JSON_EXTRACT(s.interactive_components, '$.hasTTS') = true THEN 1 END) as tts_slides
      FROM dynamic_lessons l
      LEFT JOIN dynamic_slides s ON l.id = s.lesson_id
      LEFT JOIN dynamic_lesson_progress p ON l.id = p.lesson_id
      WHERE l.is_active = true
    `);

    res.json(stats[0]);
  } catch (error) {
    logger.error('Error in GET /dynamic-lessons/admin/stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// PUT /api/dynamic-lessons/:id/status - Update Lesson Status (Admin only)
router.put('/:id/status', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    await pool.execute(
      'UPDATE dynamic_lessons SET is_active = ?, updated_at = NOW() WHERE id = ?',
      [isActive, id]
    );

    logger.info(`Lesson ${id} status updated to ${isActive ? 'active' : 'inactive'}`);
    res.json({ message: 'Lesson status updated successfully' });
  } catch (error) {
    logger.error(`Error in PUT /dynamic-lessons/${req.params.id}/status:`, error);
    res.status(500).json({ error: 'Failed to update lesson status' });
  }
});

// ==========================================
// SEARCH & FILTER ROUTES
// ==========================================

// GET /api/dynamic-lessons/search - Search Lessons
router.get('/search', async (req, res) => {
  try {
    const { q, difficulty, module, limit = 20 } = req.query;
    
    let query = `
      SELECT l.id, l.title, l.subtitle, l.difficulty, l.module, l.estimated_time,
             COUNT(s.id) as slide_count
      FROM dynamic_lessons l
      LEFT JOIN dynamic_slides s ON l.id = s.lesson_id
      WHERE l.is_active = true
    `;
    
    const params = [];
    
    if (q) {
      query += ' AND (l.title LIKE ? OR l.subtitle LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }
    
    if (difficulty) {
      query += ' AND l.difficulty = ?';
      params.push(difficulty);
    }
    
    if (module) {
      query += ' AND l.module = ?';
      params.push(module);
    }
    
    query += ' GROUP BY l.id ORDER BY l.title LIMIT ?';
    params.push(parseInt(limit));

    const [results] = await pool.execute(query, params);
    
    res.json(results);
  } catch (error) {
    logger.error('Error in GET /dynamic-lessons/search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;