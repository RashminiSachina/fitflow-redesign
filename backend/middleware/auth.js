const jwt = require('jsonwebtoken');
const env = require('../config/env');
const store = require('../services/store');

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = store.users.find((user) => user.id === payload.sub) || {
      id: payload.sub,
      email: payload.email,
    };
  } catch (_err) {
    req.user = null;
  }

  return next();
}

function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.user || !req.user.id) {
      const error = new Error('Authentication required.');
      error.status = 401;
      error.publicMessage = error.message;
      return next(error);
    }
    return next();
  });
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

module.exports = { optionalAuth, requireAuth, signToken };
