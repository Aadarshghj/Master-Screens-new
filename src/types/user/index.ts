export interface User {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Token-based authentication types
export interface TokenRequest {
  grant_type: string;
  client_id: string;
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

export interface RefreshTokenRequest {
  grant_type: string;
  client_id: string;
  refresh_token: string;
}
