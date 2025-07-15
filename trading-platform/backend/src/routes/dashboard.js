// src/routes/dashboard.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'dashboard endpoint working' });
});

export default router;
