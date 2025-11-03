import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (user) => api.post('/users', user),
  update: (id, user) => api.put(`/users/${id}`, user),
  delete: (id) => api.delete(`/users/${id}`),
};

export const incomeAPI = {
  getByUserId: (userId) => api.get(`/income/user/${userId}`),
  getByUser: (userId) => api.get(`/income/user/${userId}`),
  getByDateRange: (userId, start, end) => api.get(`/income/user/${userId}/range`, { params: { start, end } }),
  getById: (id) => api.get(`/income/${id}`),
  create: (income) => api.post('/income', income),
  update: (id, income) => api.put(`/income/${id}`, income),
  delete: (id) => api.delete(`/income/${id}`),
};

export const expenseAPI = {
  getByUserId: (userId) => api.get(`/expenses/user/${userId}`),
  getByUser: (userId) => api.get(`/expenses/user/${userId}`),
  getByDateRange: (userId, start, end) => api.get(`/expenses/user/${userId}/range`, { params: { start, end } }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (expense) => api.post('/expenses', expense),
  update: (id, expense) => api.put(`/expenses/${id}`, expense),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const budgetAPI = {
  getByUser: (userId) => api.get(`/budgets/user/${userId}`),
  getById: (id) => api.get(`/budgets/${id}`),
  create: (budget) => api.post('/budgets', budget),
  update: (id, budget) => api.put(`/budgets/${id}`, budget),
  delete: (id) => api.delete(`/budgets/${id}`),
};

export const goalAPI = {
  getByUser: (userId) => api.get(`/goals/user/${userId}`),
  getById: (id) => api.get(`/goals/${id}`),
  create: (goal) => api.post('/goals', goal),
  update: (id, goal) => api.put(`/goals/${id}`, goal),
  delete: (id) => api.delete(`/goals/${id}`),
};

export const netWorthAPI = {
  getByUser: (userId) => api.get(`/networth/user/${userId}`),
  getById: (id) => api.get(`/networth/${id}`),
  create: (netWorth) => api.post('/networth', netWorth),
  update: (id, netWorth) => api.put(`/networth/${id}`, netWorth),
  delete: (id) => api.delete(`/networth/${id}`),
};

export const categoryAPI = {
  getByUserId: (userId) => api.get(`/categories/user/${userId}`),
  getByUserIdAndType: (userId, type) => api.get(`/categories/user/${userId}/type/${type}`),
  getById: (id) => api.get(`/categories/${id}`),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const recurringTransactionAPI = {
  getByUser: (userId) => api.get(`/recurring/user/${userId}`),
  getActiveByUser: (userId) => api.get(`/recurring/user/${userId}/active`),
  getById: (id) => api.get(`/recurring/${id}`),
  create: (transaction) => api.post('/recurring', transaction),
  update: (id, transaction) => api.put(`/recurring/${id}`, transaction),
  delete: (id) => api.delete(`/recurring/${id}`),
  generateInstances: (userId, year, month) => api.get(`/recurring/user/${userId}/generate/${year}/${month}`),
};

export default api;
