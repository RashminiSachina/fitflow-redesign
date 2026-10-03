function health(_req, res) {
  res.json({
    ok: true,
    service: 'fitflow-backend',
    mode: 'in-memory',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { health };
