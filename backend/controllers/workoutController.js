const store = require('../services/store');
const { recommend } = require('../services/workoutEngine');

function recommendation(req, res, next) {
  try {
    const goal = req.query.goal || (req.user && req.user.goal) || 'stay_active';
    const minutes = req.query.minutes || 25;
    res.json(recommend({ goal, minutes }));
  } catch (error) {
    next(error);
  }
}

function listWorkouts(req, res, next) {
  try {
    const userId = req.user.id;
    res.json({ workouts: store.workoutsByUser[userId] || [] });
  } catch (error) {
    next(error);
  }
}

function createWorkout(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, exercises, durationMinutes, intensity } = req.body || {};

    if (!name || !Array.isArray(exercises) || exercises.length === 0) {
      const error = new Error('A workout needs a name and at least one exercise.');
      error.status = 400;
      error.publicMessage = error.message;
      throw error;
    }

    const workout = {
      id: store.createId('wo'),
      name: String(name).trim(),
      intensity: intensity || 'Moderate',
      durationMinutes: Number(durationMinutes) || 20,
      exercises: exercises.map((item, index) => ({
        id: item.id || `ex-${index + 1}`,
        name: String(item.name || '').trim(),
        sets: Number(item.sets) || 3,
        reps: Number(item.reps) || 10,
        unit: item.unit || 'reps',
      })),
      createdAt: new Date().toISOString(),
    };

    if (!store.workoutsByUser[userId]) {
      store.workoutsByUser[userId] = [];
    }
    store.workoutsByUser[userId].unshift(workout);

    res.status(201).json(workout);
  } catch (error) {
    next(error);
  }
}

module.exports = { recommendation, listWorkouts, createWorkout };
