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

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
    const response = await api.post('/auth/signup', credentials);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Passwords API
export const passwordsAPI = {
  getAll: async (): Promise<Password[]> => {
    const response = await api.get('/passwords');
    return response.data;
  },

  getById: async (id: string): Promise<Password> => {
    const response = await api.get(`/passwords/${id}`);
    return response.data;
  },

  create: async (data: CreatePasswordData): Promise<Password> => {
    const response = await api.post('/passwords', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePasswordData): Promise<Password> => {
    const response = await api.put(`/passwords/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/passwords/${id}`);
    return response.data;
  },
};

export default api; 