import { jwtDecode } from "jwt-decode";

export type JwtResponseDto = {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  sid: string;
  acr: string;
  "allowed-origins": string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: string[];
    };
  };
  scope: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

export const getJwtData = (): JwtResponseDto | null => {
  const token = sessionStorage.getItem("access_token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
