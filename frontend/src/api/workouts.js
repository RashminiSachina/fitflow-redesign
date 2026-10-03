import { apiRequest } from './client';

export function fetchRecommendation(goal, minutes) {
  const query = `?goal=${encodeURIComponent(goal || 'stay_active')}&minutes=${encodeURIComponent(minutes || 25)}`;
  return apiRequest(`/workouts/recommendation${query}`, { auth: false });
}

export function fetchWorkouts() {
  return apiRequest('/workouts');
}

export function saveWorkoutRemote(workout) {
  return apiRequest('/workouts', { method: 'POST', body: workout });
}
