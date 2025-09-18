// driverfront-app/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', // Nest back‑end
  withCredentials: true,
});

export const register = (data: any) => api.post('/auth/register', data);
export const login = (data: any) => api.post('/auth/login', data);

// Protected endpoint – token must be supplied
export const getMe = (token: string) =>
  api.post(
    '/auth/me',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );