import { getAccessToken, refreshAccessToken, clearAuth } from '@/lib/auth/token-store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  retry?: boolean;
}

export class ApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`API Error ${status}`);
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth = false, retry = true, headers, ...rest } = options;

  const finalHeaders = new Headers(headers);
  finalHeaders.set('Content-Type', 'application/json');

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers: finalHeaders });

  if (res.status === 401 && !skipAuth && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, { ...options, retry: false });
    clearAuth();
    throw new ApiError(401, null);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiClient = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'DELETE' }),
};