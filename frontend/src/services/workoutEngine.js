/**
 * Local rule-based Daily Flow engine (offline fallback).
 * A TensorFlow Lite model can replace recommend() later.
 */

const PLANS = {
  lose_weight: {
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
  build_muscle: {
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
  stay_active: {
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
  endurance: {
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
};

const LABELS = {
  lose_weight: 'fat-loss',
  build_muscle: 'strength',
  stay_active: 'daily movement',
  endurance: 'cardio endurance',
};

export function recommendLocal({ goal = 'stay_active', minutes = 25 }) {
  const key = PLANS[goal] ? goal : 'stay_active';
  const plan = { ...PLANS[key] };
  const budget = Number(minutes) || 25;
  return {
    ...plan,
    goal: key,
    requestedMinutes: budget,
    explanation: `Chosen for a ${LABELS[key]} goal with about ${budget} minutes free. ${plan.name} is a complete session you can finish today.`,
    source: 'local-rule-engine',
  };
}

export const LIBRARY_EXERCISES = [
  { name: 'Bodyweight squats', sets: 3, reps: 12 },
  { name: 'Push-ups', sets: 3, reps: 8 },
  { name: 'Glute bridges', sets: 3, reps: 12 },
  { name: 'Plank', sets: 3, reps: 30, unit: 'seconds' },
  { name: 'Reverse lunges', sets: 3, reps: 10 },
  { name: 'Dead bug', sets: 2, reps: 10 },
  { name: 'Jumping jacks', sets: 3, reps: 30 },
  { name: 'Mountain climbers', sets: 3, reps: 20 },
];
