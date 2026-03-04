/* eslint-disable @typescript-eslint/no-explicit-any */
// =============================================================================
// SHARED BASE TYPES
// =============================================================================

export interface BaseEntity {
  identity: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  isActive?: boolean;
}

export interface BaseFormData {
  customerIdentity?: string | null;
  readonly?: boolean;
}

export interface BaseFormProps {
  onFormSubmit?: (data: any) => void | Promise<void>;
  initialData?: any;
  readonly?: boolean;
  customerIdentity?: string | null;
}

export interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerIdentity?: string | null;
  customerData?: any; // BasicInfoData
  handleCloseViewModal?: () => void;
}

export interface HistoryTableProps {
  customerId?: string;
}

export interface BaseFormErrors {
  [key: string]: string | undefined;
  general?: string;
}

// =============================================================================
// SHARED UI TYPES
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  // API response fields
  identity?: string;
  statusName?: string;
  isActive?: boolean;
  // Additional common fields
  name?: string;
  code?: string;
  displayName?: string;
}

export interface ConfigOption {
  value: string;
  label: string;
  disabled?: boolean;
  identity?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  accessor?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

// =============================================================================
// SHARED API TYPES
// =============================================================================

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: string;
  identity?: string;
  // Common pagination fields
  total?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  status?: number;
  data?: {
    message?: string;
    error?: string;
    details?: Record<string, string>;
    serviceCode?: string;
    errorCode?: string;
  };
  message?: string;
}

// =============================================================================
// SHARED FORM TYPES
// =============================================================================

export interface FormState {
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  className?: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface FormValidationRules {
  [key: string]: ValidationRule;
}

// =============================================================================
// SHARED LOCATION TYPES
// =============================================================================

export interface CustomerLocationData {
  country: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  latitude: number | string;
  longitude: number | string;
}

export interface PostOffice {
  id: number | string;
  name: string;
  pincode: string;
  identity?: string;
}

export interface PincodeDetails {
  pincode: string;
  state: string;
  district: string;
  city: string;
  postOffices?: PostOffice[];
}

// =============================================================================
// SHARED CUSTOMER TYPES
// =============================================================================

export interface CustomerBasicInfo {
  customerIdentity: string;
  customerCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  mobileNumber: string;
  email?: string;
  dob?: string;
  gender?: string;
  fatherName?: string;
  motherName?: string;
  maritalStatus?: string;
  nationality?: string;
  branchId?: string;
  branchCode?: string;
}

// =============================================================================
// SHARED STATUS TYPES
// =============================================================================

export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";

// =============================================================================
// SHARED CONSTANTS
// =============================================================================

export const MARITAL_STATUS_VALUES = {
  SINGLE: "Single",
  MARRIED: "Married",
  DIVORCED: "Divorced",
  WIDOWED: "Widowed",
} as const;

// =============================================================================
// SHARED ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_DATE: "Please enter a valid date",
  FILE_TOO_LARGE: "File size should not exceed 50MB",
  INVALID_FILE_TYPE: "Please select a valid file type",
  NETWORK_ERROR: "Network error. Please try again.",
  VALIDATION_ERROR: "Please fix the errors and try again",
  SEARCH_NO_RESULTS: "No results found for your search criteria",
  DOCUMENT_UPLOAD_FAILED: "Failed to upload document. Please try again.",
  OTP_INVALID: "Invalid OTP. Please try again.",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",
} as const;

export const SUCCESS_MESSAGES = {
  DOCUMENT_UPLOADED: "Document uploaded successfully",
  DOCUMENT_VERIFIED: "Document verified successfully",
  FORM_SAVED: "Form saved successfully",
  CUSTOMER_SELECTED: "Customer selected successfully",
  OTP_SENT: "OTP sent successfully",
  OTP_VERIFIED: "OTP verified successfully",
  SEARCH_COMPLETED: "Search completed successfully",
} as const;

// =============================================================================
// SHARED FILE UPLOAD TYPES
// =============================================================================

export interface FileUploadConfig {
  acceptedFormats: string;
  maxSize: string;
  allowedTypes: string[];
  maxSizeBytes: number;
}

export const FILE_UPLOAD_CONFIG: FileUploadConfig = {
  acceptedFormats: ".pdf,.jpg,.jpeg,.png,.tiff,.tif",
  maxSize: "50MB",
  allowedTypes: [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/tiff",
    "image/tif",
  ],
  maxSizeBytes: 50 * 1024 * 1024, // 50MB
} as const;

export interface FileUploadState {
  originalFile: File | null;
  originalBase64: string;
  maskedBase64: string | null;
  isProcessing: boolean;
  uploadError: string | null;
  isFileValid: boolean;
  dragActive: boolean;
}

// =============================================================================
// SHARED LOGGER TYPES
// =============================================================================

export interface LoggerOptions {
  toast?: boolean;
  pushLog?: boolean;
  user?: any;
}

// =============================================================================
// SHARED UTILITY TYPES
// =============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// =============================================================================
// SHARED REQUEST/RESPONSE TYPES
// =============================================================================

export interface BaseRequest {
  customerId: string;
  createdBy: number;
  updatedBy?: number;
}

export interface BaseResponse extends BaseEntity {
  message?: string;
  status?: string;
}

// =============================================================================
// SHARED COMPONENT PROPS
// =============================================================================

export interface BaseTableProps {
  readonly?: boolean;
  customerIdentity?: string | null;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
}

export interface BaseFormComponentProps {
  readonly?: boolean;
  customerIdentity?: string | null;
  onFormSubmit?: (data: any) => void | Promise<void>;
  initialData?: any;
}

// =============================================================================
// SHARED VALIDATION TYPES
// =============================================================================

export interface ValidationContext {
  field: string;
  value: unknown;
  formData: Record<string, unknown>;
  rules: ValidationRule;
}

// =============================================================================
// SHARED MASTER DATA TYPES
// =============================================================================

export interface MasterDataOption extends BaseEntity {
  name: string;
  code?: string;
  displayName?: string;
  description?: string;
  isActive: boolean;
  // Additional fields that might be present
  relationship?: string;
  gender?: string;
  statusName?: string;
  taxCatName?: string;
  salutation?: string;
}

// =============================================================================
// SHARED SERVICE TYPES
// =============================================================================

export interface ServiceLocationResponse {
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface ServicePincodeDetailsResponse {
  pincode: string;
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  postOffices: PostOffice[];
}
