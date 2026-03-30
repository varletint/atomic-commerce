import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Silent Refresh State ───────────────────────────
let isRefreshing = false;
let refreshFailed = false; // prevents loops after a failed refresh
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}[] = [];

function processQueue(error: unknown | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(undefined);
    }
  });
  failedQueue = [];
}

/** Call this after a successful login/register to re-enable refresh */
export function resetRefreshState() {
  refreshFailed = false;
}

// Paths that should NEVER trigger a silent refresh
const NO_REFRESH_PATHS = [
  '/users/login',
  '/users/register',
  '/users/refresh',
  '/users/logout',
  '/users/forgot-password',
  '/users/reset-password',
  '/users/resend-verification',
];

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return true;
  return NO_REFRESH_PATHS.some((path) => url.includes(path));
}

// ── Response Interceptor ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip: not a 401, already retried, a public/auth route, or refresh already failed
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      shouldSkipRefresh(originalRequest.url) ||
      refreshFailed
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => api(originalRequest));
    }

    // First 401 → kick off the refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post('/users/refresh');
      processQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      refreshFailed = true;
      processQueue(refreshError);

      // Clear auth state so the UI stops treating the user as logged-in
      useAuthStore.getState().clearAuth();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
