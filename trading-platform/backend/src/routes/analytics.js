// src/routes/analytics.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'analytics endpoint working' });
});

export default router;
