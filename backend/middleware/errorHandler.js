function notFound(req, res, next) {
  const error = new Error(`Not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const message = err.publicMessage || err.message || 'Server error';

  if (status >= 500) {
    console.error('[error]', err);
  }

  res.status(status).json({
    error: true,
    message,
    status,
  });
}

module.exports = { notFound, errorHandler };
