import { logger } from "@/global/service";
import { ENV } from "@/config";
export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

// Storage keys constants
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  EXPIRES_IN: "token_expires_in",
  EXPIRES_AT: "token_expires_at",
  TOKEN_TYPE: "token_type",
} as const;
let refreshTimer: number | null = null;

const REFRESH_THRESHOLD = 60 * 1000;

export const scheduleTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const expiresAt = sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
  if (!expiresAt) return;

  const expiresIn = parseInt(expiresAt) - Date.now();
  if (expiresIn <= 0) {
    refreshAccessToken();
    return;
  }

  const refreshIn = Math.max(expiresIn - REFRESH_THRESHOLD, 1000);

  if (expiresIn <= 0) {
    refreshAccessToken();
    return;
  }

  refreshTimer = window.setTimeout(async () => {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      logout();
      return;
    }
    scheduleTokenRefresh();
  }, refreshIn);
};

// Store tokens in sessionStorage (cleared when browser closes)
export const storeTokens = (tokenData: TokenData): void => {
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokenData.access_token);
  sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokenData.refresh_token);
  sessionStorage.setItem(
    STORAGE_KEYS.EXPIRES_IN,
    tokenData.expires_in.toString()
  );
  sessionStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokenData.token_type);

  // Store expiration time
  const expirationTime = Date.now() + tokenData.expires_in * 1000;
  sessionStorage.setItem(STORAGE_KEYS.EXPIRES_AT, expirationTime.toString());
  scheduleTokenRefresh();
};

// Get access token
export const getAccessToken = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

// Get refresh token
export const getRefreshToken = (): string | null => {
  return sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

// Check if token is expired
export const isTokenExpired = (): boolean => {
  const expiresAt = sessionStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
  if (!expiresAt) return true;

  return Date.now() >= parseInt(expiresAt);
};

// Clear all tokens
export const clearTokens = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.EXPIRES_IN);
  sessionStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessToken();
  return !!accessToken && !isTokenExpired();
};

// Refresh access token
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const keycloakUrl = `${ENV.VITE_KEYCLOAK_BASE_URL}/realms/Incede-dev/protocol/openid-connect/token`;

    const formData = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: "cbfs-fe",
      refresh_token: refreshToken,
    });

    const response = await fetch(keycloakUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tokenData = await response.json();

    // Store new tokens
    storeTokens(tokenData);
    return tokenData.access_token;
  } catch {
    logger.error("Failed to refresh token", {
      pushLog: false,
      toast: false,
    });
    clearTokens();
    return null;
  }
};

// Get valid access token (refresh if needed)
export const getValidAccessToken = async (): Promise<string | null> => {
  if (!isTokenExpired()) {
    return getAccessToken();
  }

  return await refreshAccessToken();
};

// Logout user (clear tokens and redirect to login)
export const logout = (): void => {
  clearTokens();
  // Dispatch a custom logout event to notify other tabs
  window.dispatchEvent(new CustomEvent("logout"));
  // Redirect to login
  window.location.href = "/login";
};

// Legacy object for backward compatibility (can be removed later)
export const tokenManager = {
  storeTokens,
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  clearTokens,
  isAuthenticated,
  refreshAccessToken,
  getValidAccessToken,
  logout,
};
