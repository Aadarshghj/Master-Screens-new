export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  errorCode: string;
  correlationId: string;
}

export interface ApiErrorResponse {
  data?: ApiError;
  error?: {
    status: number;
    data: ApiError;
  };
}
