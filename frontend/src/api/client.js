import { config } from '../config';
import { getJson, keys } from '../services/storage';

export class ApiError extends Error {
  constructor(message, status, offline = false) {
    super(message);
    this.status = status;
    this.offline = offline;
  }
}

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.apiTimeoutMs);
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getJson(keys.token);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new ApiError(data.message || 'Request failed', response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Unable to reach the FitFlow API. Showing saved data.', 0, true);
  } finally {
    clearTimeout(timer);
  }
}
