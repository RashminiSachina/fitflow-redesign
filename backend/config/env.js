const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fitflow-dev-only-change-me',
  jwtExpiresIn: '7d',
  // MongoDB Atlas would be wired here via MONGODB_URI (see config/db.js).
  mongodbUri: process.env.MONGODB_URI || '',
};
