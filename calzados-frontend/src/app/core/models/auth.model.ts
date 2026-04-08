// src/app/core/models/auth.model.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  userId: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'CAJERO';
}

export interface AuthUser {
  userId: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'CAJERO';
}
