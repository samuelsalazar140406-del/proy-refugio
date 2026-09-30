import { getToken, clearToken } from '../auth/session';

const baseUrl = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);
  if (response.status === 401) clearToken();
  if (!response.ok) throw new ApiError(body?.error ?? 'No se pudo completar la solicitud', response.status, body);
  return body as T;
}
