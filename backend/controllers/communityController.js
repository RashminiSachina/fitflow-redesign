const store = require('../services/store');

function listChallenges(req, res, next) {
  try {
    const joined = (req.user && store.joinedChallengesByUser[req.user.id]) || [];
    res.json({
      challenges: store.challenges.map((challenge) => ({
        ...challenge,
        joined: joined.includes(challenge.id),
      })),
      privacyNote: 'Circles are private. Activity is shared only if you enable it in Profile.',
    });
  } catch (error) {
    next(error);
  }
}

function joinChallenge(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const challenge = store.challenges.find((item) => item.id === id);

    if (!challenge) {
      const error = new Error('Challenge not found.');
      error.status = 404;
      error.publicMessage = error.message;
      throw error;
    }

    if (!store.joinedChallengesByUser[userId]) {
      store.joinedChallengesByUser[userId] = [];
    }

    if (!store.joinedChallengesByUser[userId].includes(id)) {
      store.joinedChallengesByUser[userId].push(id);
      challenge.members += 1;
    }

    res.json({ ok: true, challengeId: id, joined: true, members: challenge.members });
  } catch (error) {
    next(error);
  }
}

function leaveChallenge(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const challenge = store.challenges.find((item) => item.id === id);

    if (!challenge) {
      const error = new Error('Challenge not found.');
      error.status = 404;
      error.publicMessage = error.message;
      throw error;
    }

    const list = store.joinedChallengesByUser[userId] || [];
    store.joinedChallengesByUser[userId] = list.filter((item) => item !== id);
    if (list.includes(id) && challenge.members > 0) {
      challenge.members -= 1;
    }

    res.json({ ok: true, challengeId: id, joined: false, members: challenge.members });
  } catch (error) {
    next(error);
  }
}

function feed(req, res, next) {
  try {
    res.json({
      posts: store.feed,
      leaderboard: store.leaderboard,
      privacyNote: 'Circles are private. Only members of a circle can see its posts.',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { listChallenges, joinChallenge, leaveChallenge, feed };
