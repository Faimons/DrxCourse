// src/routes/lessons.js
import express from 'express';

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get all lessons
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Mock lessons data
    const lessons = [
      { id: 1, title: 'Trading Grundlagen', duration: 30, completed: false },
      { id: 2, title: 'Technische Analyse', duration: 45, completed: false },
      { id: 3, title: 'Candlestick Patterns', duration: 40, completed: false },
      { id: 4, title: 'Risk Management', duration: 35, completed: false },
      { id: 5, title: 'Trading Psychologie', duration: 50, completed: false }
    ];

    res.json({
      success: true,
      lessons
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
