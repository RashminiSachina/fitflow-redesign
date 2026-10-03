import { apiRequest } from './client';

export function loginRequest(email, password) {
  return apiRequest('/auth/login', { method: 'POST', body: { email, password }, auth: false });
}

export function registerRequest(email, password, name, goal) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: { email, password, name, goal },
    auth: false,
  });
}
