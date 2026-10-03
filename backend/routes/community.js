const express = require('express');
const { optionalAuth, requireAuth } = require('../middleware/auth');
const {
  listChallenges,
  joinChallenge,
  leaveChallenge,
  feed,
} = require('../controllers/communityController');

const router = express.Router();

router.get('/challenges', optionalAuth, listChallenges);
router.post('/challenges/:id/join', requireAuth, joinChallenge);
router.post('/challenges/:id/leave', requireAuth, leaveChallenge);
router.get('/feed', optionalAuth, feed);

module.exports = router;
