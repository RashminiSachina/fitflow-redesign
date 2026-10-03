import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../api/auth';
import { clearSession, getJson, keys, setJson } from '../services/storage';

const AuthContext = createContext(null);

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    (async () => {
      const savedUser = await getJson(keys.user);
      const savedToken = await getJson(keys.token);
      if (savedUser && savedToken) {
        setUser(savedUser);
        setToken(savedToken);
      }
      setReady(true);
    })();
  }, []);

  async function persist(nextUser, nextToken, usedOffline) {
    await setJson(keys.user, nextUser);
    await setJson(keys.token, nextToken);
    setUser(nextUser);
    setToken(nextToken);
    setOffline(Boolean(usedOffline));
  }

  async function login(email, password) {
    if (!isValidEmail(email) || String(password).length < 6) {
      throw new Error('Use a valid email and a password of at least 6 characters.');
    }

    try {
      const data = await loginRequest(email, password);
      await persist(data.user, data.token, false);
      return data.user;
    } catch (error) {
      const localUser = {
        id: 'local-user',
        email: email.trim().toLowerCase(),
        name: email.split('@')[0],
        goal: 'stay_active',
      };
      await persist(localUser, `local-${Date.now()}`, true);
      return localUser;
    }
  }

  async function register(email, password, name, goal) {
    if (!isValidEmail(email) || String(password).length < 6) {
      throw new Error('Use a valid email and a password of at least 6 characters.');
    }

    try {
      const data = await registerRequest(email, password, name, goal);
      await persist(data.user, data.token, false);
      return data.user;
    } catch (_error) {
      const localUser = {
        id: 'local-user',
        email: email.trim().toLowerCase(),
        name: name || email.split('@')[0],
        goal: goal || 'stay_active',
      };
      await persist(localUser, `local-${Date.now()}`, true);
      return localUser;
    }
  }

  async function updateUser(patch) {
    const next = { ...user, ...patch };
    await setJson(keys.user, next);
    setUser(next);
  }

  async function logout() {
    await clearSession();
    setUser(null);
    setToken(null);
    setOffline(false);
  }

  const value = useMemo(
    () => ({ user, token, ready, offline, setOffline, login, register, logout, updateUser }),
    [user, token, ready, offline],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
