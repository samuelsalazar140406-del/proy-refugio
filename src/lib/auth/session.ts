const TOKEN_KEY = 'refugio_token';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
};

export const saveToken = (token: string): void => window.localStorage.setItem(TOKEN_KEY, token);
export const clearToken = (): void => window.localStorage.removeItem(TOKEN_KEY);
export const hasSession = (): boolean => Boolean(getToken());
