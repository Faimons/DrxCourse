// src/routes/videoProgress.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'videoProgress endpoint working' });
});

export default router;
