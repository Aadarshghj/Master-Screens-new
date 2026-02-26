import type { ConfirmationModalData } from "@/layout/BasePageLayout";
import type {
  KycFormData,
  KycFormErrors,
  UploadedDocument,
  CKYCData,
  CustomerData,
  CKYCSearchForm,
  CustomerSearchForm,
  FileUploadState,
  DocumentType,
  DocumentTypeOption,
} from "./common.types";
import type { FileUploadConfig } from "./shared.types";

export interface KycDataResponse {
  documentTypes: DocumentTypeOption[];
  ckycData: CKYCData[];
  customerData: CustomerData[];
  kycSteps: Array<{
    key: string;
    label: string;
  }>;
}

export interface KycSubmissionPayload {
  documentType: string;
  idNumber: string;
  placeOfIssue?: string;
  issuingAuthority?: string;
  validFrom?: string;
  validTo?: string;
  documentVerified: boolean;
  activeStatus: boolean;
  aadharOtp?: string;
  documentFile?: string;
}

export interface KycState {
  kycFormData?: KycFormData;
  kycFormErrors?: KycFormErrors;
  isKycFormSubmitting?: boolean;

  otpTransactionId?: string | null;
  isValidatingOtp?: boolean;
  isVerifyingOtp?: boolean;
  verifiedPhoto?: string | null;
  otpValidationError?: string | null;
  otpVerificationError?: string | null;

  ckycSearchForm?: CKYCSearchForm;
  customerSearchForm?: CustomerSearchForm;
  ckycSearchResults?: CKYCData[];
  customerSearchResults?: CustomerData[];
  isSearching?: boolean;
  isSearched?: boolean;
  selectedDocument?: UploadedDocument | null;

  // Document management - required
  uploadedDocuments: UploadedDocument[];

  // Modal states - optional
  isSearchModalOpen?: boolean;
  isOtpModalOpen?: boolean;
  selectedCKYCCustomer?: CKYCData | null;
  activeSearchTab?: "Customer" | "CKYC";

  // Workflow states - optional
  currentStep?: string;
  completedSteps?: Set<string>;
  stepData?: Record<string, unknown>;

  // File upload - optional
  fileUpload?: FileUploadState;

  // Document types - optional
  documentTypes?: DocumentTypeOption[];
  isLoadingDocumentTypes?: boolean;
  documentTypesError?: string | null;
}

// File Processing Constants
export interface FileConstants {
  MAX_SIZE: number;
  VALID_TYPES: readonly string[];
}

// Async Thunk Return Types
export interface ProcessFileResult {
  file: File;
  base64: string;
}

// Action Payload Types
export interface UpdateFormFieldPayload {
  field: keyof KycFormData;
  value: unknown;
}

export interface PhotoLivenessPayload {
  captureBy?: string;
  latitude?: string;
  longitude?: string;
  accuracy?: string;
  captureDevice?: string;
  locationDescription?: string;
  filePath?: string;
  captureTime?: string;
}

export interface DocumentUpdatePayload {
  id: string;
  updates: Partial<UploadedDocument>;
}

export interface StepDataPayload {
  step: string;
  data: unknown;
}

// KYC-specific Component Props
export interface KycDocumentFormProps {
  customerIdentity?: string | null;
  onFormSubmit?: (data: KycFormData) => void;
  onSave?: (data: KycFormData) => void;
  initialData?: Partial<KycFormData>;
  readOnly?: boolean;
  customerCreationMode?: boolean;
  tableData?: KycTableDocument[];
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface DocumentsTableProps {
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
}

export interface KYCPageProps {
  customerIdentity?: string | null;
  readOnly?: boolean;
  customerCreationMode?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface SearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectCustomer?: (customer: CustomerData | CKYCData) => void;
  defaultTab?: "Customer" | "CKYC";
}

export interface CustomerSearchProps {
  onSelectCustomer?: (customer: CustomerData) => void;
  onSearchResults?: (results: CustomerData[]) => void;
}

export interface DocumentsTableProps {
  customerIdentity?: string | null;
  readonly?: boolean;
  isView?: boolean;
}

export interface KYCPageProps {
  customerIdentity?: string | null;
}

export interface SearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelectCustomer?: (customer: CustomerData | CKYCData) => void;
  defaultTab?: "Customer" | "CKYC";
}

export interface CustomerSearchProps {
  onSelectCustomer?: (customer: CustomerData) => void;
  onSearchResults?: (results: CustomerData[]) => void;
}

export interface KycStepperProps {
  currentStep: string;
  onStepChange: (step: string) => void;
  completedSteps: string[];
  readonly?: boolean;
}

// KYC Document Management
export interface KycDocumentManager {
  documents: UploadedDocument[];
  activeDocument: UploadedDocument | null;
  uploadProgress: number;
  isUploading: boolean;
}

export interface KycDocumentActions {
  uploadDocument: (file: File, documentType: string) => Promise<void>;
  verifyDocument: (documentId: string) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
  viewDocument: (documentId: string) => void;
}

// KYC Validation Specific
export interface KycValidationContext {
  documentType: string;
  customerType: "individual" | "corporate";
  isAadharRequired: boolean;
  isPanRequired: boolean;
}

export interface KycValidationError {
  field: keyof KycFormData;
  message: string;
  severity: "error" | "warning";
}

// KYC Workflow Types
export interface KycWorkflowStep {
  id: string;
  name: string;
  component: string;
  isRequired: boolean;
  isCompleted: boolean;
  canSkip: boolean;
  validationRules?: string[];
}

export interface KycWorkflowState {
  currentStepId: string;
  steps: KycWorkflowStep[];
  formData: Partial<KycFormData>;
  errors: KycFormErrors;
  isSubmitting: boolean;
  completionPercentage: number;
}

// KYC Configuration
export interface KycDocumentConfig {
  type: string;
  label: string;
  isRequired: boolean;
  maxFileSize: number;
  allowedFormats: string[];
  validationRules: string[];
}

export interface KycModuleConfig {
  documentTypes: KycDocumentConfig[];
  workflow: KycWorkflowStep[];
  fileUpload: FileUploadConfig;
  apiEndpoints: {
    upload: string;
    verify: string;
    submit: string;
  };
}

// API Response Types for Aadhaar services
export interface MaskAadharRequest {
  image_format: string;
  aadhar_image: string;
}

export interface MaskAadharResponse {
  success: boolean;
  masked_image?: string;
  data?: string;
  error?: string;
  message?: string;
  msg?: string;
  aadhaar_detected?: boolean;
  aadhaar_masked?: boolean;
  response_image: string;
  transactionId?: string;
}

// Vault API types for /ext/vault/maskuid
export interface VaultMaskRequest {
  maskuid: string; // Aadhaar number
}

export interface VaultMaskResponse {
  uidTokenHash: string | null;
  message: string | null;
  Status: string;
  UidForDisplay: string;
  Uid: string;
  UidReferenceKey: string; // This will be used as vaultId
  TokenizeErrorCode: string;
  ErrorCode: string;
}

export interface AadharOtpRequest {
  image_format: string;
  aadhar_image: string;
}

export interface AadharOtpResponse {
  success: boolean;
  initiation_transaction_id: string;
  message?: string;
  error?: string;
}

export interface AadharOtpVerifyRequest {
  initiationTransactionId: string;
  otp: string;
}

export interface AadharOtpVerifyResponse {
  success: boolean;
  photo?: string;
  image?: string;
  data?: string;
  message?: string;
  error?: string;
}

export interface PhotoMatchingResponse {
  success: boolean;
  match: boolean;
  confidence?: number;
  message?: string;
}

// API Service Types
export interface KycApiService {
  fetchDocumentTypes: () => Promise<DocumentType[]>;
  submitKycForm: (data: KycFormData) => Promise<void>;
  uploadDocument: (file: File) => Promise<string>;
  maskAadhar: (request: MaskAadharRequest) => Promise<MaskAadharResponse>;
  initiateAadharOtp: (request: AadharOtpRequest) => Promise<AadharOtpResponse>;
  verifyAadharOtp: (
    request: AadharOtpVerifyRequest
  ) => Promise<AadharOtpVerifyResponse>;
  matchPhoto: (
    photo1: string,
    photo2: string
  ) => Promise<PhotoMatchingResponse>;
}

export interface UseKycFormReturn {
  formData: KycFormData;
  errors: KycFormErrors;
  isSubmitting: boolean;
  isDirty: boolean;
  updateField: (field: keyof KycFormData, value: unknown) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  validateField: (field: keyof KycFormData) => boolean;
  validateForm: () => boolean;
}

export interface FilePreviewProps {
  file?: File | null;
  base64?: string;
  className?: string;
  onRemove?: () => void;
}

export interface KycOTPFieldProps {
  name: string;
  label: string;
  length: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export interface RootState {
  kyc: KycState;
}

export interface ThunkConfig {
  state: RootState;
  rejectValue: string;
}

export type {
  KycFormData,
  KycFormErrors,
  UploadedDocument,
  FileUploadConfig,
  CKYCData,
  CustomerData,
  CKYCSearchForm,
  CustomerSearchForm,
  FileUploadState,
};

export interface OtpTransactionState {
  transactionId: string | null;
  isOtpSent: boolean;
  isOtpVerified: boolean;
  otpAttempts: number;
  maxAttempts: number;
  expiryTime?: string;
}

export interface NameMatchingRequest {
  name1: string;
  name2: string;
}

export interface NameMatchingResponse {
  success: boolean;
  match: boolean;
  confidence?: number;
  similarity_score?: number;
  message?: string;
  error?: string;
}

export interface ValidateKycRequest {
  idNumber: string;
  kycId: number;
  dob?: string;
}
export interface AllClassOfVehicle {
  nonTransport: {
    expiryDate: string;
    issueDate: string;
  };
  transport: {
    expiryDate: string;
    issueDate: string;
  };
  hazardousExpiry: string;
  hillExpiry: string;
  cov: string;
  covCategory: string;
  covVehicleClass: string;
  covIssueDate: string;
  expiryDate: string;
  issueDate: string;
}
export interface ValidateKycResponse {
  success: boolean;
  valid: boolean;
  kycStatus: string;
  status: string;
  message?: string;
  error?: { message: string; responseCode: string };
  kycResult?: {
    idNumber: string;
    idStatus: string;
    category: string;
    name: string;
    allClassOfVehicle?: AllClassOfVehicle[];
  };
  document_details?: {
    name?: string;
    father_name?: string;
    dob?: string;
    address?: string;
    photo?: string;
  };
  verification_status?: "verified" | "pending" | "failed";
}

export interface UpiMatchingRequest {
  upiId: string;
  customerId?: string;
  customerName?: string;
}
export interface UpiMatchingResponse {
  success: boolean;
  match: boolean;
  confidence: number;
  message?: string;
  error?: string;
  upi_details?: {
    account_holder_name?: string;
    bank_name?: string;
    verified_at?: string;
  };
}

// NEW: Generic API Response wrapper - NO ANY TYPES
export interface KycApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status_code?: number;
}

// NEW: OTP Transaction State for managing Aadhaar OTP flow
export interface OtpTransactionState {
  transactionId: string | null;
  isOtpSent: boolean;
  isOtpVerified: boolean;
  otpAttempts: number;
  maxAttempts: number;
  expiryTime?: string;
}

// KYC Document Page Types
export type DocumentConfigKey =
  | "PAN"
  | "AADHAAR"
  | "PASSPORT"
  | "DL"
  | "VOTER ID";

export interface DocumentConfig {
  label: string;
  placeholder: string;
  hasValidityDates: boolean;
  hasOtpSection: boolean;
  hasNameField: boolean;
  hasDobField: boolean;
  hasPlaceOfIssue: boolean;
  hasIssuingAuthority: boolean;
  maxLength: number;
  pattern: RegExp;
}
interface KycUpload {
  identity: string;
  documentReference: string;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadStatus: string;
  version: number;
  uploadDate: string;
}

interface KycTableDocument extends Partial<UploadedDocument> {
  idType?: string;
  isVerified?: boolean;
  isActive?: boolean;
  idNumber?: string;
  validFrom?: string;
  validTo?: string;
  maskedId?: string;
  identity?: string;
  kycUploads?: KycUpload[];
  placeOfIssue?: string;
  issuingAuthority?: string;
  documentCode?: string;
}
export interface KycDataResponseDto {
  identity: string;
  customerCode: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  customerStatus: string;
  onboardingStatus: string;
  branchId: string;
  kycDocuments: KycTableDocument[];
}
