import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';

function getBaseUrl(): string {
  if (__DEV__) {
    return Platform.select({
      android: 'http://10.0.2.2:3000',
      ios: 'http://localhost:3000',
      default: 'http://localhost:3000',
    })!;
  }
  return 'https://tradelink.venix.com.au';
}

const API_BASE_URL = getBaseUrl();

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, params } = options;

  let url = `${API_BASE_URL}/api${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, value);
      }
    }
    const qs = searchParams.toString();
    if (qs) {
      url += `?${qs}`;
    }
  }

  const token = useAuthStore.getState().token;
  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {}
    throw new ApiError(response.status, response.statusText, errorBody);
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | undefined>) =>
    request<T>(endpoint, { params }),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: 'PUT', body }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
};
