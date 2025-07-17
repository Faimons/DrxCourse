import express from 'express';
import { lessonController } from '../controllers/lessonController.js';
import authMiddleware from '../middleware/auth.js';  // KORRIGIERT
import { adminOnly } from '../middleware/adminAuth.js';

const router = express.Router();

// Public Routes
router.get('/', lessonController.getAllLessons);
router.get('/:id', lessonController.getLessonById);

// Protected Routes
router.use(authMiddleware); // KORRIGIERT: authMiddleware statt authenticateToken

router.post('/:id/progress', lessonController.updateProgress);
router.get('/:id/progress/:userId', lessonController.getLessonProgress);

// Admin Only Routes
router.post('/import', adminOnly, lessonController.importLesson);
router.delete('/:id', adminOnly, lessonController.deleteLesson);

export default router;