import { ApiError, ApiResponse, RequestConfig } from './types';

class ApiClient {
  private baseUrl: string = '';
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { retries = 0, retryDelay = 1000, timeout = 10000, ...customConfig } = config;
    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers: {
          ...this.defaultHeaders,
          ...customConfig.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: response.statusText || 'Request failed',
          status: response.status,
          data: errorData,
        } as ApiError;
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error: any) {
      clearTimeout(id);

      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return this.request<T>(endpoint, {
          ...config,
          retries: retries - 1,
        });
      }

      throw {
        message: error.message || 'Network error',
        code: error.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
        status: error.status,
        data: error.data,
      } as ApiError;
    }
  }

  get<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  post<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: any, config?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, config?: RequestConfig) {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
