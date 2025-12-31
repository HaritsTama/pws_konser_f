import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Concert
export const getAllConcerts = async (status = 'approved') => {
  const response = await api.get(`/users/1/concert?status=${status}`);
  return response.data;
};

export const getConcertById = async (id) => {
  const response = await api.get(`/users/1/concert/${id}`);
  return response.data;
};

export const createConcert = async (userId, data) => {
  const response = await api.post(`/users/${userId}/concert`, data);
  return response.data;
};

export const searchConcerts = async (query) => {
  const response = await api.get(`/concert/search?q=${query}`);
  return response.data;
};

// Booking
export const createBooking = async (userId, data) => {
  const response = await api.post(`/users/${userId}/booking`, data);
  return response.data;
};

export const getUserBookings = async (userId) => {
  const response = await api.get(`/users/${userId}/booking`);
  return response.data;
};

// Admin
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const updateConcertStatus = async (userId, concertId, status) => {
  const response = await api.put(`/users/${userId}/concert/${concertId}`, { status });
  return response.data;
};

export const deleteConcert = async (userId, concertId) => {
  const response = await api.delete(`/users/${userId}/concert/${concertId}`);
  return response.data;
};

export default api;