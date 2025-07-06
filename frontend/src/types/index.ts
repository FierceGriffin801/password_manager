export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  lastLogin: string;
}

export interface Password {
  _id: string;
  user: string;
  site: string;
  username: string;
  password: string;
  decryptedPassword?: string;
  notes: string;
  category: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface CreatePasswordData {
  site: string;
  username: string;
  password: string;
  notes?: string;
  category?: string;
  url?: string;
}

export interface UpdatePasswordData {
  site?: string;
  username?: string;
  password?: string;
  notes?: string;
  category?: string;
  url?: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
} 