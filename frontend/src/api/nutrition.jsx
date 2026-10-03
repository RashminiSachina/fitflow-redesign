import { apiRequest } from './client';

export function recognizeFood(payload = {}) {
  return apiRequest('/nutrition/recognize', { method: 'POST', body: payload, auth: false });
}

export function fetchMealLogs() {
  return apiRequest('/nutrition/logs');
}

export function saveMealLog(entry) {
  return apiRequest('/nutrition/logs', { method: 'POST', body: entry });
}
