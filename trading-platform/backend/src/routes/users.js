// src/routes/users.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user.userId,
        email: req.user.email,
        name: 'Admin User'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
