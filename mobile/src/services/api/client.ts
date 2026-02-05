import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);
