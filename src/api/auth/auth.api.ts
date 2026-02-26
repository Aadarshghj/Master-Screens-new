import { ENV } from "@/config";

export const auth = {
  // Token-based authentication endpoints - Using Keycloak
  getToken: () =>
    `${ENV.VITE_KEYCLOAK_BASE_URL}/realms/Incede-dev/protocol/openid-connect/token`,
  refreshToken: () =>
    `${ENV.VITE_KEYCLOAK_BASE_URL}/realms/Incede-dev/protocol/openid-connect/token`,

  // Legacy endpoints (keeping for backward compatibility)
  create: () => "/create-account",
  login: () => "/login",
};
