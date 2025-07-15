// src/routes/admin.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'admin endpoint working' });
});

export default router;
