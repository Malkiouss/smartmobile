const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAdminAnalytics } = require('../controllers/adminAnalyticsController');

router.get('/analytics-test', (req, res) => {
  res.json({ ok: true, message: 'Analytics route works' });
});

router.get('/analytics', protect, getAdminAnalytics);

module.exports = router;
