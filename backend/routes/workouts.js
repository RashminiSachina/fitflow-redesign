const express = require('express');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const {
  recommendation,
  listWorkouts,
  createWorkout,
} = require('../controllers/workoutController');

const router = express.Router();

router.get('/recommendation', optionalAuth, recommendation);
router.get('/', requireAuth, listWorkouts);
router.post('/', requireAuth, createWorkout);

module.exports = router;
