const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const env = require('./config/env');
const { connectMongo } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const communityRoutes = require('./routes/community');
const nutritionRoutes = require('./routes/nutrition');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/nutrition', nutritionRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectMongo();
  app.listen(env.port, '0.0.0.0', () => {
    console.log(`FitFlow API listening on http://localhost:${env.port}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, start };
