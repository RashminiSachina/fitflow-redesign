const express = require('express');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const {
  recognizeFood,
  listLogs,
  addLog,
} = require('../controllers/nutritionController');

const router = express.Router();

router.post('/recognize', optionalAuth, recognizeFood);
router.get('/logs', requireAuth, listLogs);
router.post('/logs', requireAuth, addLog);

module.exports = router;
