import {
  getAccessToken,
  isTokenExpired,
  refreshAccessToken,
  clearTokens,
} from "@/utils/token.utils";
import type { AxiosInstance } from "axios";
import axios from "axios";

export const createAxiosInstance = (baseUrl: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 30000, // Increased timeout to 30 seconds
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    // Add CORS configuration
    withCredentials: false,
  });

  instance.interceptors.request.use(
    async config => {
      // Get access token (check if expired first)
      const token = getAccessToken();
      // const token=
      if (token && !isTokenExpired()) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Skip modification for OTP verification requests
      if (config.url?.includes("/otp/") && config.url?.includes("/verify")) {
        return config; // just return config as is
      }

      // Handle FormData uploads
      if (config.data instanceof FormData) {
        // Let browser set correct Content-Type with boundary
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
      }
      // RTK Query handles JSON serialization automatically
      // No need to stringify here

      return config;
    },
    error => Promise.reject(error)
  );

  // Add response interceptor for token refresh on 401
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
          }
        } catch {
          // Refresh failed, redirect to login
          clearTokens();
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
