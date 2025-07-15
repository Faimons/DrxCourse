// src/routes/checkout.js
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'checkout endpoint working' });
});

export default router;
