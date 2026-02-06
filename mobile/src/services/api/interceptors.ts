import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { secureStorage } from '../storage';
import { authEvents } from './auth-events';

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}[] = [];

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/magic-link', '/auth/refresh'];

const isPublicPath = (url?: string) => PUBLIC_PATHS.some((path) => url?.startsWith(path));

const processQueue = (error: Error | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
};

export function setupInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (!isPublicPath(config.url)) {
        const token = await secureStorage.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isPublicPath(originalRequest.url)
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => resolve(token),
              reject,
            });
          }).then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await secureStorage.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await client.post('/auth/refresh', {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data.data as {
            access_token: string;
            refresh_token: string;
          };

          await secureStorage.setTokens(access_token, newRefreshToken);

          processQueue(null, access_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError as Error, null);
          await secureStorage.clearTokens();
          authEvents.notifyUnauthorized();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );
}
