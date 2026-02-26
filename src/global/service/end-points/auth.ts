import type {
  LoginRequest,
  UserResponse,
  TokenRequest,
  TokenResponse,
  RefreshTokenRequest,
} from "@/types";
import { apiInstance } from "../api-instance";
import { api } from "@/api";

export const authApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    // Legacy login endpoint (keeping for backward compatibility)
    login: build.mutation<UserResponse, LoginRequest>({
      query: credentials => {
        return {
          url: api.auth.login(),
          method: "POST",
          data: credentials as unknown as Record<string, unknown>,
        };
      },
    }),

    // New token-based authentication - Using Keycloak
    getToken: build.mutation<TokenResponse, TokenRequest>({
      query: credentials => {
        const formData = new URLSearchParams({
          grant_type: "password",
          client_id: "cbfs-fe",
          username: credentials.username,
          password: credentials.password,
        });

        return {
          url: api.auth.getToken(),
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: formData.toString(),
        };
      },
    }),

    // Refresh token endpoint - Using Keycloak
    refreshToken: build.mutation<TokenResponse, RefreshTokenRequest>({
      query: refreshData => {
        const formData = new URLSearchParams({
          grant_type: "refresh_token",
          client_id: "cbfs-fe",
          refresh_token: refreshData.refresh_token,
        });
        return {
          url: api.auth.refreshToken(),
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: formData.toString(),
        };
      },
    }),

    protected: build.mutation<{ message: string }, void>({
      query: () => ({ url: "protected" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetTokenMutation,
  useRefreshTokenMutation,
  useProtectedMutation,
} = authApiService;
