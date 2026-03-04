export interface OtpSendPayload {
  tenantId: number;
  branchCode: string;
  templateCatalogIdentity: string;
  templateContentIdentity: string;
  target: string;
  customerIdentity: number;
  length: number;
  ttlSeconds: number;
  // Index signature to make it compatible with Record<string, unknown>
  [key: string]: unknown;
}

export interface OtpSendResponse {
  requestId: string;
  expiresAt: string;
  status: string;
}

export interface OtpVerifyPayload {
  code: number;
  // Index signature to make it compatible with Record<string, unknown>
  [key: string]: unknown;
}

export interface OtpVerifyResponse {
  result: string;
  success: boolean;
  message?: string;
}

// Generic API Response Types
export interface BaseApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status_code?: number;
}

export interface BasePaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
  message?: string;
}

// API Error Types
export interface APIError {
  data?: {
    message?: string;
    errors?: Record<string, string>;
    details?: Record<string, string>;
  };
  message?: string;
}
