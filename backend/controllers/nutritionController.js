const store = require('../services/store');
const { recognize } = require('../services/nutritionEngine');

function recognizeFood(req, res, next) {
  try {
    res.json(recognize(req.body || {}));
  } catch (error) {
    next(error);
  }
}

function listLogs(req, res, next) {
  try {
    const userId = req.user.id;
    const logs = store.mealLogsByUser[userId] || [];
    const today = new Date().toISOString().slice(0, 10);
    const todayLogs = logs.filter((log) => log.loggedAt.slice(0, 10) === today);
    const calories = todayLogs.reduce((sum, log) => sum + Number(log.calories || 0), 0);

    res.json({ logs, todayCalories: calories, date: today });
  } catch (error) {
    next(error);
  }
}

function addLog(req, res, next) {
  try {
    const userId = req.user.id;
    const name = String((req.body && req.body.name) || '').trim();
    const calories = Number(req.body && req.body.calories);

    if (!name || !Number.isFinite(calories) || calories < 0) {
      const error = new Error('Provide a food name and a calorie value.');
      error.status = 400;
      error.publicMessage = error.message;
      throw error;
    }

    const entry = {
      id: store.createId('meal'),
      name,
      calories,
      photoUri: req.body.photoUri || null,
      loggedAt: new Date().toISOString(),
    };

    if (!store.mealLogsByUser[userId]) {
      store.mealLogsByUser[userId] = [];
    }
    store.mealLogsByUser[userId].unshift(entry);

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
}

module.exports = { recognizeFood, listLogs, addLog };
