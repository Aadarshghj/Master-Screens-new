export interface UseFileUploadReturn {
  selectedFile: File | null;
  base64Data: string;
  loading: boolean;
  error: string;
  success: boolean;
  handleFileSelect: (file: File) => Promise<void>;
  clearFile: () => void;
}

export interface UseFileUploadOptions {
  shouldConvertToBase64?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export interface CustomerIdentity {
  identity: string;
  customerCode: string;
  status: string;
}

export interface UseCustomerIdentityReturn {
  customerId: string | null;
  customerData: CustomerIdentity | null;
  setCustomerId: (id: string) => void;
  clearCustomer: () => void;
}
