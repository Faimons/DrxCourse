// src/routes/lead.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'lead endpoint working' });
});

export default router;
