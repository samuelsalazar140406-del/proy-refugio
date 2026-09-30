import { apiRequest } from './client';

export interface LoginResponse { token: string; }

export const loginRequest = (usuario: string, contrasena: string) => apiRequest<LoginResponse>('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ usuario, contrasena }),
});

export const logoutRequest = () => apiRequest<{ mensaje: string }>('/auth/logout', { method: 'POST' });
