export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

export interface RequestConfig extends RequestInit {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
}
