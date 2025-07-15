// src/routes/video.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'video endpoint working' });
});

export default router;
