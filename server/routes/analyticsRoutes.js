const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const dataStore = require('../services/dataStore');

// GET /api/analytics/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const stats = await dataStore.getAnalyticsStats();
    res.json({ stats });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to retrieve analytics metrics.' });
  }
});

module.exports = router;
