const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('chatflow-auth');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.state?.tokens?.accessToken || null;
    } catch {
      return null;
    }
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  }

  private handleError(status: number, body: any): never {
    const message = body?.error?.message || body?.message || `Request failed (${status})`;
    throw new ApiError(message, status, body?.error?.details);
  }

  async request<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      if (response.status === 401) {
        localStorage.removeItem('chatflow-auth');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        this.handleError(response.status, body);
      }

      if (response.status === 204) return undefined as T;
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof TypeError ? 'Network error - check your connection' : 'An unexpected error occurred',
        0,
      );
    }
  }

  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return this.request<T>(path, { method: 'GET', params });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_URL);
export default api;
