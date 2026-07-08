import axios from 'axios';

/**
 * Zentrale Axios-Instanz für alle API-Aufrufe.
 * Vorbereitet für zukünftiges Auth-Token-Handling (Interceptor auskommentiert).
 */
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Vorbereitung für JWT-Authentifizierung:
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export default api;
