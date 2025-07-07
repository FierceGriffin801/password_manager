import axios from 'axios';
import { 
  AuthResponse, 
  LoginCredentials, 
  SignupCredentials, 
  Password, 
  CreatePasswordData, 
  UpdatePasswordData,
  User 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://password-manager-backend-on1f.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Passwords API
export const passwordsAPI = {
  getAll: async (): Promise<Password[]> => {
    const response = await api.get('/api/passwords');
    return response.data;
  },

  getById: async (id: string): Promise<Password> => {
    const response = await api.get(`/api/passwords/${id}`);
    return response.data;
  },

  create: async (data: CreatePasswordData): Promise<Password> => {
    const response = await api.post('/api/passwords', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePasswordData): Promise<Password> => {
    const response = await api.put(`/api/passwords/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/passwords/${id}`);
    return response.data;
  },
};

export default api; 