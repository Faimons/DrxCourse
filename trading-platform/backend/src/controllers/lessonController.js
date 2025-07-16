// trading-platform/backend/src/controllers/lessonController.js
import pool from '../config/database.js';
import logger from '../utils/logger.js';

export const lessonController = {
  // GET /api/lessons - Alle Lektionen
  getAllLessons: async (req, res) => {
    try {
      const { page = 1, limit = 10, difficulty, module } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT l.*, 
               COUNT(s.id) as total_slides,
               COUNT(CASE WHEN s.type = 'quiz' THEN 1 END) as quiz_slides
        FROM dynamic_lessons l
        LEFT JOIN dynamic_slides s ON l.id = s.lesson_id
        WHERE l.is_active = true
      `;
      
      const params = [];
      
      if (difficulty) {
        query += ' AND l.difficulty = ?';
        params.push(difficulty);
      }
      
      if (module) {
        query += ' AND l.module = ?';
        params.push(module);
      }
      
      query += ' GROUP BY l.id ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const [lessons] = await pool.execute(query, params);
      
      // Parse JSON fields
      lessons.forEach(lesson => {
        if (lesson.objectives) lesson.objectives = JSON.parse(lesson.objectives);
        if (lesson.metadata) lesson.metadata = JSON.parse(lesson.metadata);
      });

      res.json({
        lessons,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: lessons.length
        }
      });
    } catch (error) {
      logger.error('Error getting lessons:', error);
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  },

  // GET /api/lessons/:id - Spezifische Lektion mit allen Slides
  getLessonById: async (req, res) => {
    try {
      const { id } = req.params;

      // Lesson Details
      const [lessonResult] = await pool.execute(
        'SELECT * FROM dynamic_lessons WHERE id = ? AND is_active = true',
        [id]
      );

      if (lessonResult.length === 0) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      const lesson = lessonResult[0];
      
      // Parse JSON fields
      if (lesson.objectives) lesson.objectives = JSON.parse(lesson.objectives);
      if (lesson.metadata) lesson.metadata = JSON.parse(lesson.metadata);

      // Slides für diese Lektion
      const [slidesResult] = await pool.execute(`
        SELECT * FROM dynamic_slides 
        WHERE lesson_id = ? 
        ORDER BY slide_order ASC
      `, [id]);

      // Parse JSON fields für Slides
      const slides = slidesResult.map(slide => ({
        ...slide,
        content: JSON.parse(slide.content),
        interactive_components: slide.interactive_components ? 
          JSON.parse(slide.interactive_components) : {}
      }));

      lesson.slides = slides;

      res.json(lesson);
    } catch (error) {
      logger.error('Error getting lesson by ID:', error);
      res.status(500).json({ error: 'Failed to fetch lesson' });
    }
  },

  // POST /api/lessons/import - Import migrierte Lektion
  importLesson: async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { lesson } = req.body;
      
      // Insert Lesson
      await connection.execute(`
        INSERT INTO dynamic_lessons 
        (id, title, subtitle, module, difficulty, estimated_time, objectives, metadata)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        lesson.id,
        lesson.title,
        lesson.subtitle,
        lesson.module,
        lesson.difficulty,
        lesson.estimatedTime,
        JSON.stringify(lesson.objectives),
        JSON.stringify(lesson.metadata || {})
      ]);

      // Insert Slides
      for (let i = 0; i < lesson.slides.length; i++) {
        const slide = lesson.slides[i];
        
        await connection.execute(`
          INSERT INTO dynamic_slides 
          (id, lesson_id, slide_order, title, subtitle, type, duration, content, speech_script, interactive_components, original_type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          slide.id,
          lesson.id,
          i + 1,
          slide.title,
          slide.subtitle || '',
          slide.type,
          slide.duration || 3,
          JSON.stringify(slide.content),
          slide.speechScript || '',
          JSON.stringify(slide.interactiveComponents || {}),
          slide.originalType || slide.type
        ]);
      }

      // Migration Status eintragen
      await connection.execute(`
        INSERT INTO migration_status (original_file, lesson_id, status, migration_date)
        VALUES (?, ?, 'migrated', NOW())
      `, [lesson.metadata?.sourceFile || 'unknown', lesson.id]);

      await connection.commit();
      
      logger.info(`Lesson imported successfully: ${lesson.id}`);
      res.json({ message: 'Lesson imported successfully', lessonId: lesson.id });
      
    } catch (error) {
      await connection.rollback();
      logger.error('Error importing lesson:', error);
      res.status(500).json({ error: 'Failed to import lesson' });
    } finally {
      connection.release();
    }
  },

  // POST /api/lessons/:id/progress - Update User Progress
  updateProgress: async (req, res) => {
    try {
      const { id: lessonId } = req.params;
      const { slideId, timeSpent, completed, quizScore, quizPassed } = req.body;
      const userId = req.user.id; // Aus auth middleware

      await pool.execute(`
        INSERT INTO dynamic_lesson_progress 
        (user_id, lesson_id, slide_id, time_spent, quiz_score, quiz_passed, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        time_spent = VALUES(time_spent),
        quiz_score = VALUES(quiz_score),
        quiz_passed = VALUES(quiz_passed),
        completed_at = VALUES(completed_at),
        updated_at = NOW()
      `, [
        userId,
        lessonId,
        slideId,
        timeSpent || 0,
        quizScore || null,
        quizPassed || false,
        completed ? new Date() : null
      ]);

      res.json({ message: 'Progress updated successfully' });
    } catch (error) {
      logger.error('Error updating progress:', error);
      res.status(500).json({ error: 'Failed to update progress' });
    }
  },

  // GET /api/lessons/:id/progress/:userId - User Progress für Lektion
  getLessonProgress: async (req, res) => {
    try {
      const { id: lessonId, userId } = req.params;

      const [progress] = await pool.execute(`
        SELECT s.id as slide_id, s.title, s.type, s.slide_order,
               p.completed_at, p.time_spent, p.quiz_score, p.quiz_passed
        FROM dynamic_slides s
        LEFT JOIN dynamic_lesson_progress p ON s.id = p.slide_id AND p.user_id = ?
        WHERE s.lesson_id = ?
        ORDER BY s.slide_order
      `, [userId, lessonId]);

      res.json(progress);
    } catch (error) {
      logger.error('Error getting lesson progress:', error);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  },

  // DELETE /api/lessons/:id - Delete Lesson (Admin only)
  deleteLesson: async (req, res) => {
    try {
      const { id } = req.params;

      await pool.execute(
        'UPDATE dynamic_lessons SET is_active = false WHERE id = ?',
        [id]
      );

      res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      logger.error('Error deleting lesson:', error);
      res.status(500).json({ error: 'Failed to delete lesson' });
    }
  }
};

// trading-platform/backend/src/routes/lessons.js
import express from 'express';
import { lessonController } from '../controllers/lessonController.js';
import { authenticateToken } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Public Routes
router.get('/', lessonController.getAllLessons);
router.get('/:id', lessonController.getLessonById);

// Protected Routes
router.use(authenticateToken); // Alle nachfolgenden Routes brauchen Auth

router.post('/:id/progress', lessonController.updateProgress);
router.get('/:id/progress/:userId', lessonController.getLessonProgress);

// Admin Only Routes
router.post('/import', adminOnly, lessonController.importLesson);
router.delete('/:id', adminOnly, lessonController.deleteLesson);

export default router;