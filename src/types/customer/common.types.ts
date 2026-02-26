import type { DMSFileData } from "@/hooks/useDMSFileUpload";
import type { ValidationRule } from "./shared.types";

export interface KycFormData {
  documentType: "PAN" | "AADHAAR" | "PASSPORT" | "DL" | "ADH" | "" | "VOTER ID";
  idNumber: string;
  placeOfIssue?: string | null;
  issuingAuthority?: string;
  validFrom?: string | null;
  validTo?: string | null;
  documentFile: File | null | string;
  aadharOtp?: string | null;
  documentVerified: boolean;
  activeStatus: boolean;
  captureBy?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  accuracy?: string | null;
  captureDevice?: string | null;
  locationDescription?: string | null;
  filePath?: string | null;
  captureTime?: string | null;
  // Additional fields for different document types
  // nameOnDocument?: string;
  dateOfBirth?: string;
  fathersName?: string;
  address?: string;
  constituency?: string;
  vehicleClasses?: string;
  bloodGroup?: string;
  dateOfIssue?: string;

  // File upload and UI state moved to useForm
  selectedFileName: string;
  selectedFile: File | null;
  dmsFileData: DMSFileData | null;
  originalIdNumber: string;
  maskedAadharResponse: {
    maskedAadhar: string;
    transactionId: string;
  } | null;
  vaultId: string;
  verifiedIdNumber: string;
  validUntil?: string;
  maskedId?: string;
  // File selection and API response fields are now managed by useState
}
export interface KycFormErrors {
  documentType?: string;
  idNumber?: string;
  placeOfIssue?: string;
  issuingAuthority?: string;
  validFrom?: string;
  validTo?: string;
  documentFile?: string;
  aadharOtp?: string;
  general?: string;
  // Additional field errors
  // nameOnDocument?: string;
  fathersName?: string;
  dateOfBirth?: string;
  address?: string;
  constituency?: string;
  vehicleClasses?: string;
  bloodGroup?: string;
  dateOfIssue?: string;
  validUntil?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: KycFormErrors;
}

// Status and Enum Types
export type DocumentVerificationStatus = "Verified" | "Pending" | "Rejected";
export type DocumentActiveStatus = "Active" | "Inactive" | "Expired";
export type CustomerStatus = "Active" | "Inactive" | "Suspended";
export type Gender = "Male" | "Female" | "Other";
export type DocumentType =
  | "driving_license"
  | "passport"
  | "aadhar"
  | "pan"
  | "voter"
  | ""
  | "undefined";
export type VerificationStatus = "Verified" | "Pending" | "Rejected";

export const DOCUMENT_TYPE_VALUES = {
  DRIVING_LICENSE: "driving_license",
  PASSPORT: "passport",
  AADHAR: "aadhar",
  PAN: "pan",
  VOTER: "voter",
} as const;

export const VERIFICATION_STATUS_VALUES = {
  VERIFIED: "Verified",
  PENDING: "Pending",
  REJECTED: "Rejected",
} as const;

export const CUSTOMER_STATUS_VALUES = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
} as const;

export const GENDER_VALUES = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
} as const;

export interface SampleUploadedDocument
  extends Omit<UploadedDocument, "file" | "uploadDate"> {
  file?: File;
  uploadDate?: Date;
}

export interface UploadedDocument {
  file: File | unknown;
  id: string;
  customer: string;
  name: string;
  documentType: string;
  idNumber: string;
  uploadDate: string;
  validFrom?: string | null; // Allow null
  validTo?: string | null; // Allow null
  verified: DocumentVerificationStatus;
  document: string;
  status: DocumentActiveStatus;
  placeOfIssue?: string;
  issuingAuthority?: string;
  uploadedAt?: string;
  fileData?: File;
}

export interface DocumentTypeOption {
  description: string;
  displayName: string;
  identity: string;
  code: string;
}
export interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (otp: string) => void;
}

export interface CKYCData {
  ckycNumber: string;
  customerName: string;
  fatherName: string;
  gender: string;
  dob: string;
  mobile: string;
  city: string;
}

export interface CustomerData {
  customerIdentity: string;
  isCustomerExist: boolean;
  isLeadExist: boolean | null;
  branchCode: string;
  displayName: string;
  customerCode: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fatherName: string | null;
  houseName: string | null;
  mobile: string;
  city: string | null;
  isFirm?: boolean;
  onboardingStatus?: string;
  approvalStatus?: string;
}

// Search Form Types
export interface CKYCSearchForm {
  kycType: string;
  aadhaarNumber: string;
  dob: string;
}

export interface CustomerSearchForm {
  customerId?: string;
  customerName?: string;
  branchCode?: string;
  branchId?: number;
  mobile?: string;
  email?: string;
  panCard?: string;
  aadharNumber?: string;
  voterId?: string;
  passport?: string;
}

export interface SearchFilters {
  ckyc: CKYCSearchForm;
  customer: CustomerSearchForm;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface SearchFiltersState {
  documentType?: string;
  verificationStatus?: DocumentVerificationStatus;
  activeStatus?: DocumentActiveStatus;
  dateRange?: DateRange;
  searchTerm?: string;
}

// File Upload Types
export interface FileUploadState {
  originalFile: File | null;
  originalBase64: string;
  maskedBase64: string | null;
  isProcessing: boolean;
  uploadError: string | null;
  isFileValid: boolean;
  dragActive: boolean;
}

export interface MaskFileRequest {
  aadharBase64Data: string;
  imageFormat: string;
}

export interface MaskFileResponse {
  success: boolean;
  maskedBase64?: string;
  result?: string;
  data?: string;
  aadharBase64Data?: string;
  error?: string;
  message?: string;
}

// FileUploadConfig moved to shared.types.ts to avoid duplication

// FILE_UPLOAD_CONFIG moved to shared.types.ts to avoid duplication

export const FILE_UPLOAD_CONSTANTS = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  VALID_TYPES: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/tiff",
    "image/tif",
    "application/pdf",
  ],
  VALID_EXTENSIONS: [".png", ".jpg", ".jpeg", ".tiff", ".tif", ".pdf"],
} as const;

// Component Props Types (Shared)
export interface AadharOtpInputProps {
  onValidate: () => void;
  onVerify: () => void;
  isValidating?: boolean;
  isVerifying?: boolean;
}

export interface DocumentTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
}

export interface StatusBadgeProps {
  status: string;
  type: "verification" | "status";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export interface DocumentsTableProps {
  documents?: UploadedDocument[];
  onViewDocument?: (documentId: string) => void;
  onEditDocument?: (documentId: string) => void;
  onDeleteDocument?: (documentId: string) => void;
  onDownloadDocument?: (documentId: string) => void;
}

// Search Component Props
export interface CKYCSearchProps {
  onSelectCustomer: (customerData: CKYCData) => void;
  onSearchResults?: (results: CKYCData[]) => void;
}

export interface CustomerSearchProps {
  onSelectCustomer: (customerData: CustomerData) => void;
  onSearchResults?: (results: CustomerData[]) => void;
  toggleViewCustomerDetails: () => void;
  handleSetCustomerId: (id: string) => void;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer?: (customerData: CKYCData | CustomerData) => void;
  defaultTab?: "Customer" | "CKYC";
  toggleViewCustomerDetails?: () => void;
  viewCustomerDetails?: boolean;
}

export interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (otp: string) => void;
  phoneNumber?: string;
  resendDelay?: number;
}

// Stepper and Onboarding Types
export interface Step {
  key: string;
  label: string;
  path?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: string;
  onStepChange?: (stepKey: string) => void;
  className?: string;
  variant?: "default" | "compact";
  completedSteps?: Set<string>;
}

export interface KycOnboardingPageProps {
  initialStep?: string;
  onStepComplete?: (step: string, data: string) => void;
  onSave?: (step: string, data: string) => void;
  onReset?: () => void;
  readonly?: boolean;
}

export interface OnboardingStepData {
  [stepKey: string]: string;
}

export interface OnboardingState {
  currentStep: string;
  completedSteps: Set<string>;
  stepData: OnboardingStepData;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// API Response Types
export interface KycDocumentResponse {
  success: boolean;
  data?: UploadedDocument;
  message?: string;
  errors?: string[];
}

export interface DocumentListResponse {
  success: boolean;
  data: UploadedDocument[];
  total: number;
  page: number;
  limit: number;
}

export interface CKYCSearchResponse {
  success: boolean;
  data: CKYCData[];
  total: number;
  message?: string;
}

export interface CustomerSearchResponse {
  success: boolean;
  data: CustomerData[];
  total: number;
  message?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

// Redux State Types
export interface CustomerReduxState {
  kycFormData: KycFormData;
  kycFormErrors: KycFormErrors;
  isKycFormSubmitting: boolean;
  ckycSearchForm: CKYCSearchForm;
  customerSearchForm: CustomerSearchForm;
  ckycSearchResults: CKYCData[];
  customerSearchResults: CustomerData[];
  isSearching: boolean;
  isSearched: boolean;
  uploadedDocuments: UploadedDocument[];
  selectedDocument: UploadedDocument | null;
  isSearchModalOpen: boolean;
  isOtpModalOpen: boolean;
  selectedCKYCCustomer: CKYCData | null;
  activeSearchTab: "Customer" | "CKYC";
  currentStep: string;
  completedSteps: Set<string>;
  stepData: OnboardingStepData;
}

// Common UI Types
// FormFieldProps moved to shared.types.ts to avoid duplication

// SelectOption moved to shared.types.ts to avoid duplication

// TableColumn moved to shared.types.ts to avoid duplication

// TableProps moved to shared.types.ts to avoid duplication

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// Action Types
export interface UpdateFormFieldAction<
  K extends keyof KycFormData = keyof KycFormData,
> {
  field: K;
  value: KycFormData[K];
}

export interface SearchAction {
  searchType: "ckyc" | "customer";
  filters: CKYCSearchForm | CustomerSearchForm;
}

export interface CustomerSelectionAction {
  customerData: CKYCData | CustomerData;
  source: "ckyc" | "customer";
}

// Utility Types
// Optional and RequiredFields moved to shared.types.ts to avoid duplication

// Configuration Types
export interface CustomerDataConfig {
  ckycData: CKYCData[];
  customerData: CustomerData[];
  uploadedDocuments: UploadedDocument[];
  documentTypes: DocumentTypeOption[];
  kycSteps: Step[];
}

// Validation Types
// ValidationRule moved to shared.types.ts to avoid duplication

export interface FormValidationRules {
  [key: string]: ValidationRule;
}

export const KYC_FORM_VALIDATION_RULES: FormValidationRules = {
  documentType: {
    required: true,
  },
  idNumber: {
    required: true,
    minLength: 5,
    maxLength: 20,
  },
  placeOfIssue: {
    minLength: 2,
    maxLength: 50,
  },
  issuingAuthority: {
    minLength: 2,
    maxLength: 100,
  },
  validFrom: {
    required: true,
  },
  validTo: {
    required: true,
  },
  documentFile: {
    required: true,
  },
} as const;

// Default Values
export const DEFAULT_KYC_FORM_DATA: KycFormData = {
  documentType: "AADHAAR",
  idNumber: "",
  placeOfIssue: "",
  issuingAuthority: "",
  validFrom: "",
  validTo: "",
  documentFile: null,
  aadharOtp: "",
  documentVerified: false,
  activeStatus: true,
  captureBy: "",
  latitude: "",
  longitude: "",
  accuracy: "",
  captureDevice: "",
  locationDescription: "",
  filePath: "",
  captureTime: "",
  // nameOnDocument: "",
  fathersName: "",
  dateOfBirth: "",
  address: "",
  constituency: "",
  vehicleClasses: "",
  bloodGroup: "",
  dateOfIssue: "",
  validUntil: "",
  selectedFileName: "",
  selectedFile: null,
  dmsFileData: null,
  originalIdNumber: "",
  maskedAadharResponse: null,
  vaultId: "",
  verifiedIdNumber: "",
};

export const DEFAULT_CKYC_SEARCH_FORM: CKYCSearchForm = {
  kycType: "",
  aadhaarNumber: "",
  dob: "",
};

export const DEFAULT_CUSTOMER_SEARCH_FORM: CustomerSearchForm = {
  customerId: "",
  customerName: "",
  branchCode: "",
  mobile: "",
  email: "",
  panCard: "",
  aadharNumber: "",
  voterId: "",
  passport: "",
};

// Constants and Messages - moved to shared.types.ts to avoid duplication

// Common Service Types (moved from service types)
// MasterDataOption moved to shared.types.ts to avoid duplication

export interface PostOfficeResponse {
  id: number;
  name: string;
  pincode: string;
}

// ServiceLocationResponse moved to shared.types.ts to avoid duplication

// ServicePincodeDetailsResponse moved to shared.types.ts to avoid duplication

// Logger Types
export interface LoggerErrorOptions {
  toast?: boolean;
  pushLog?: boolean;
}

export interface LoggerInfoOptions {
  toast?: boolean;
  pushLog?: boolean;
  user?: import("../user").User;
}

// Axios Base Query Types
export interface AxiosBaseQueryArgs {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: Record<string, unknown> | FormData | string | unknown[] | null;
  body?: Record<string, unknown> | FormData | string | unknown[] | null; // Add body parameter
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  responseType?: "json" | "blob" | "arraybuffer" | "text" | "stream";
}

export interface AxiosBaseQueryError {
  status?: number;
  data: unknown;
}

export interface AxiosBaseQueryFnArgs {
  baseUrl: string;
  prepareHeaders?: (headers: Record<string, string>) => Record<string, string>;
}
export interface CustomerOnboardingSerarchResponse {
  content: CustomerData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}
