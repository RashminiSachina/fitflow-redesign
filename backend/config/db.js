/**
 * Database adapter (MVP: in-memory).
 *
 * MongoDB Atlas plug-in point:
 * 1. Set MONGODB_URI in .env
 * 2. npm install mongoose
 * 3. Replace the in-memory stores in services/store.js with Mongoose models
 *    under models/ and call connectMongo() from server.js on startup.
 */

const env = require('./env');

async function connectMongo() {
  if (!env.mongodbUri) {
    console.log('[db] No MONGODB_URI set — using in-memory mock data.');
    return null;
  }

  // const mongoose = require('mongoose');
  // await mongoose.connect(env.mongodbUri);
  // console.log('[db] Connected to MongoDB Atlas');
  console.log('[db] MONGODB_URI is present but mongoose is not wired yet. Using in-memory store.');
  return null;
}

module.exports = { connectMongo };
