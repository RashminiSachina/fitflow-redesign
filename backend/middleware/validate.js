function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body ? req.body[field] : undefined;
      return value === undefined || value === null || String(value).trim() === '';
    });

    if (missing.length) {
      const error = new Error(`Missing required fields: ${missing.join(', ')}`);
      error.status = 400;
      error.publicMessage = error.message;
      return next(error);
    }

    return next();
  };
}

function validateAuthBody(req, res, next) {
  const { email, password } = req.body || {};

  if (!isEmail(email)) {
    const error = new Error('Enter a valid email address.');
    error.status = 400;
    error.publicMessage = error.message;
    return next(error);
  }

  if (typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password must be at least 6 characters.');
    error.status = 400;
    error.publicMessage = error.message;
    return next(error);
  }

  return next();
}

module.exports = { isEmail, requireFields, validateAuthBody };
