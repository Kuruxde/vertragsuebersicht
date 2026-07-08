import api from './api.js';

/**
 * Kapselt alle API-Aufrufe rund um Verträge.
 * Komponenten importieren ausschließlich diese Funktionen,
 * nie direkt axios/api.
 */
export const contractService = {
  getAll: (params) => api.get('/contracts', { params }).then((res) => res.data),
  getById: (id) => api.get(`/contracts/${id}`).then((res) => res.data),
  create: (data) => api.post('/contracts', data).then((res) => res.data),
  update: (id, data) => api.put(`/contracts/${id}`, data).then((res) => res.data),
  remove: (id) => api.delete(`/contracts/${id}`),
  getDashboardStats: () => api.get('/contracts/stats/dashboard').then((res) => res.data),
};
