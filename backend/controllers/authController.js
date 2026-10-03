const store = require('../services/store');
const { toPublicUser } = require('../models/User');
const { signToken } = require('../middleware/auth');

function findByEmail(email) {
  return store.users.find((user) => user.email === email.toLowerCase());
}

function register(req, res, next) {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const password = String(req.body.password);
    const name = String(req.body.name || email.split('@')[0]).trim();
    const goal = String(req.body.goal || 'stay_active');

    if (findByEmail(email)) {
      const error = new Error('An account with this email already exists.');
      error.status = 409;
      error.publicMessage = error.message;
      throw error;
    }

    const user = {
      id: store.createId('usr'),
      email,
      password,
      name,
      goal,
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    store.workoutsByUser[user.id] = [];
    store.mealLogsByUser[user.id] = [];
    store.joinedChallengesByUser[user.id] = [];

    const token = signToken(user);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    next(error);
  }
}

function login(req, res, next) {
  try {
    const email = String(req.body.email).trim().toLowerCase();
    const password = String(req.body.password);
    let existing = findByEmail(email);

    // Lab MVP: any valid email + 6+ character password can sign in.
    if (!existing) {
      existing = {
        id: store.createId('usr'),
        email,
        password,
        name: email.split('@')[0],
        goal: 'stay_active',
        createdAt: new Date().toISOString(),
      };
      store.users.push(existing);
      store.workoutsByUser[existing.id] = [];
      store.mealLogsByUser[existing.id] = [];
      store.joinedChallengesByUser[existing.id] = [];
    } else if (existing.password !== password) {
      const error = new Error('Email or password is incorrect.');
      error.status = 401;
      error.publicMessage = error.message;
      throw error;
    }

    const token = signToken(existing);
    res.json({ token, user: toPublicUser(existing) });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
