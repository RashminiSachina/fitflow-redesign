import AsyncStorage from '@react-native-async-storage/async-storage';

export const keys = {
  token: 'fitflow.token',
  user: 'fitflow.user',
  workouts: 'fitflow.workouts',
  meals: 'fitflow.meals',
  recommendation: 'fitflow.recommendation',
  community: 'fitflow.community',
  progress: 'fitflow.progress',
  settings: 'fitflow.settings',
  offline: 'fitflow.offline',
};

export async function getJson(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
}

export async function setJson(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function remove(key) {
  await AsyncStorage.removeItem(key);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([keys.token, keys.user]);
}
