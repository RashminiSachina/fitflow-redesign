/**
 * Rule-based "AI Daily Flow" engine.
 * Swap this file for a TensorFlow Lite / remote model later without changing routes.
 */

const PLANS = {
  lose_weight: [
    {
      id: 'plan-hiit-20',
      name: 'Campus HIIT Burst',
      durationMinutes: 20,
      intensity: 'High',
      calories: 220,
      exercises: [
        { name: 'Jumping jacks', sets: 3, reps: 30 },
        { name: 'Bodyweight squats', sets: 3, reps: 15 },
        { name: 'Mountain climbers', sets: 3, reps: 20 },
        { name: 'Plank', sets: 3, reps: 30, unit: 'seconds' },
      ],
    },
    {
      id: 'plan-walk-intervals',
      name: 'Incline Walk Intervals',
      durationMinutes: 35,
      intensity: 'Moderate',
      calories: 250,
      exercises: [
        { name: 'Brisk walk', sets: 1, reps: 10, unit: 'minutes' },
        { name: 'Incline walk', sets: 3, reps: 5, unit: 'minutes' },
        { name: 'Cool-down stroll', sets: 1, reps: 5, unit: 'minutes' },
      ],
    },
  ],
  build_muscle: [
    {
      id: 'plan-push-30',
      name: 'Upper-Body Push Focus',
      durationMinutes: 30,
      intensity: 'Moderate',
      calories: 180,
      exercises: [
        { name: 'Push-ups', sets: 4, reps: 10 },
        { name: 'Pike push-ups', sets: 3, reps: 8 },
        { name: 'Tricep dips', sets: 3, reps: 12 },
        { name: 'Plank shoulder taps', sets: 3, reps: 16 },
      ],
    },
    {
      id: 'plan-legs-40',
      name: 'Lower-Body Strength',
      durationMinutes: 40,
      intensity: 'High',
      calories: 240,
      exercises: [
        { name: 'Goblet squats', sets: 4, reps: 10 },
        { name: 'Reverse lunges', sets: 3, reps: 12 },
        { name: 'Glute bridges', sets: 3, reps: 15 },
        { name: 'Calf raises', sets: 3, reps: 20 },
      ],
    },
  ],
  stay_active: [
    {
      id: 'plan-mobility-15',
      name: 'Desk Reset Mobility',
      durationMinutes: 15,
      intensity: 'Low',
      calories: 70,
      exercises: [
        { name: 'Cat-cow', sets: 2, reps: 8 },
        { name: 'World’s greatest stretch', sets: 2, reps: 6 },
        { name: 'Shoulder openers', sets: 2, reps: 10 },
        { name: 'Easy walk in place', sets: 1, reps: 3, unit: 'minutes' },
      ],
    },
    {
      id: 'plan-full-25',
      name: 'Balanced Full-Body Flow',
      durationMinutes: 25,
      intensity: 'Moderate',
      calories: 160,
      exercises: [
        { name: 'Bodyweight squats', sets: 3, reps: 12 },
        { name: 'Push-ups', sets: 3, reps: 8 },
        { name: 'Glute bridges', sets: 3, reps: 12 },
        { name: 'Dead bug', sets: 2, reps: 10 },
      ],
    },
  ],
  endurance: [
    {
      id: 'plan-run-walk-30',
      name: 'Run-Walk Builder',
      durationMinutes: 30,
      intensity: 'Moderate',
      calories: 260,
      exercises: [
        { name: 'Easy jog', sets: 5, reps: 3, unit: 'minutes' },
        { name: 'Walk recover', sets: 5, reps: 2, unit: 'minutes' },
        { name: 'Cool-down walk', sets: 1, reps: 5, unit: 'minutes' },
      ],
    },
    {
      id: 'plan-cardio-45',
      name: 'Steady Cardio Block',
      durationMinutes: 45,
      intensity: 'Moderate',
      calories: 380,
      exercises: [
        { name: 'Warm-up walk', sets: 1, reps: 5, unit: 'minutes' },
        { name: 'Steady run or cycle', sets: 1, reps: 35, unit: 'minutes' },
        { name: 'Cool-down stretch', sets: 1, reps: 5, unit: 'minutes' },
      ],
    },
  ],
};

const GOAL_LABELS = {
  lose_weight: 'fat-loss',
  build_muscle: 'strength',
  stay_active: 'daily movement',
  endurance: 'cardio endurance',
};

function normalizeGoal(goal) {
  const key = String(goal || 'stay_active')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  if (PLANS[key]) {
    return key;
  }
  if (key.includes('muscle') || key.includes('strength')) {
    return 'build_muscle';
  }
  if (key.includes('weight') || key.includes('fat')) {
    return 'lose_weight';
  }
  if (key.includes('endur') || key.includes('run')) {
    return 'endurance';
  }
  return 'stay_active';
}

function recommend({ goal, minutes }) {
  const normalizedGoal = normalizeGoal(goal);
  const available = Number(minutes);
  const budget = Number.isFinite(available) && available > 0 ? available : 25;
  const pool = PLANS[normalizedGoal];

  const fitting = pool.filter((plan) => plan.durationMinutes <= budget);
  const selected = (fitting.length ? fitting : pool).sort(
    (a, b) => Math.abs(a.durationMinutes - budget) - Math.abs(b.durationMinutes - budget),
  )[0];

  const explanation = `Chosen for a ${GOAL_LABELS[normalizedGoal]} goal with about ${budget} minutes free. ${selected.name} matches that window at ${selected.intensity.toLowerCase()} intensity so you can finish it today without overreaching.`;

  return {
    ...selected,
    goal: normalizedGoal,
    requestedMinutes: budget,
    explanation,
    source: 'rule-based-engine',
  };
}

module.exports = { recommend, PLANS };
