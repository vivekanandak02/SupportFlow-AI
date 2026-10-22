const express = require('express');
const router = express.Router();
const { classifyTicket, CATEGORY_PROFILES } = require('../services/aiClassifier');

// POST /api/classify or /api/ai/classify
router.post(['/', '/classify'], (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({ message: 'Title or description is required for classification.' });
    }

    const result = classifyTicket(title || '', description || '');
    res.json(result);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ message: 'Error processing AI ticket classification.' });
  }
});

// GET /api/ai/categories
router.get('/categories', (req, res) => {
  const categories = Object.keys(CATEGORY_PROFILES).map(key => ({
    name: key,
    team: CATEGORY_PROFILES[key].team
  }));
  res.json({ categories });
});

module.exports = router;
