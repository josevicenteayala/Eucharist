/**
 * Axios API Client Configuration
 * 
 * Configured axios instance with:
 * - Request/response interceptors
 * - Authentication token handling
 * - Error handling and transformation
 * - Standard response format
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@/types/api';

/**
 * Base API URL from environment variables
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Configured axios instance for API calls
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request interceptor to add authentication token
 */
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling and response transformation
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle 401 Unauthorized - clear token and redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Transform error to ApiError
    const apiError = transformAxiosError(error);
    
    // Log error
    console.error('[API Error]', {
      message: apiError.message,
      code: apiError.code,
      statusCode: apiError.statusCode,
      ...(process.env.NODE_ENV === 'development' && { details: apiError.details })
    });

    return Promise.reject(apiError);
  }
);

/**
 * Transform Axios error to ApiError
 */
function transformAxiosError(error: AxiosError<ApiErrorResponse>): ApiError {
  // Server responded with error
  if (error.response?.data?.error) {
    const { code, message, details } = error.response.data.error;
    return new ApiError(
      message,
      code,
      error.response.status,
      details
    );
  }

  // Network error or no response
  if (error.request && !error.response) {
    return new ApiError(
      'Network error. Please check your connection.',
      'NETWORK_ERROR',
      undefined,
      error.message
    );
  }

  // Request setup error
  return new ApiError(
    error.message || 'An unexpected error occurred',
    'REQUEST_ERROR',
    undefined,
    error
  );
}

/**
 * Generic GET request
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  
  if (response.data.success) {
    return response.data as ApiSuccessResponse<T>;
  }
  
  // This shouldn't happen if interceptor works correctly, but added for type safety
  const errorData = response.data as ApiErrorResponse;
  throw new ApiError(
    errorData.error.message,
    errorData.error.code,
    response.status,
    errorData.error.details
  );
}

/**
 * Generic POST request
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  
  if (response.data.success) {
    return response.data as ApiSuccessResponse<T>;
  }
  
  const errorData = response.data as ApiErrorResponse;
  throw new ApiError(
    errorData.error.message,
    errorData.error.code,
    response.status,
    errorData.error.details
  );
}

/**
 * Generic PUT request
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  
  if (response.data.success) {
    return response.data as ApiSuccessResponse<T>;
  }
  
  const errorData = response.data as ApiErrorResponse;
  throw new ApiError(
    errorData.error.message,
    errorData.error.code,
    response.status,
    errorData.error.details
  );
}

/**
 * Generic PATCH request
 */
export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
  
  if (response.data.success) {
    return response.data as ApiSuccessResponse<T>;
  }
  
  const errorData = response.data as ApiErrorResponse;
  throw new ApiError(
    errorData.error.message,
    errorData.error.code,
    response.status,
    errorData.error.details
  );
}

/**
 * Generic DELETE request
 */
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiSuccessResponse<T>> {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  
  if (response.data.success) {
    return response.data as ApiSuccessResponse<T>;
  }
  
  const errorData = response.data as ApiErrorResponse;
  throw new ApiError(
    errorData.error.message,
    errorData.error.code,
    response.status,
    errorData.error.details
  );
}

// Export default for backward compatibility
export default apiClient;
