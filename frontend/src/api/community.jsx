import { apiRequest } from './client';

export function fetchChallenges() {
  return apiRequest('/community/challenges');
}

export function fetchFeed() {
  return apiRequest('/community/feed');
}

export function joinChallenge(id) {
  return apiRequest(`/community/challenges/${id}/join`, { method: 'POST', body: {} });
}

export function leaveChallenge(id) {
  return apiRequest(`/community/challenges/${id}/leave`, { method: 'POST', body: {} });
}
