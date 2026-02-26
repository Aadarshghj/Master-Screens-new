// Shared common types (import first for consistency)
export * from "./shared.types";

// Feature-specific types - using explicit exports to avoid conflicts
export type {
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
  CustomerSearchProps,
  SearchModalProps,
  DocumentsTableProps,
  OTPModalProps,
  Step,
  StepperProps,
  KycOnboardingPageProps,
  OnboardingStepData,
  OnboardingState,
  KycDocumentResponse,
  DocumentListResponse,
  CKYCSearchResponse,
  CustomerSearchResponse,
  OTPResponse,
  CustomerReduxState,
  FilterOption,
  UpdateFormFieldAction,
  SearchAction,
  CustomerSelectionAction,
  CustomerDataConfig,
  LoggerErrorOptions,
  LoggerInfoOptions,
  PostOfficeResponse,
  DEFAULT_KYC_FORM_DATA,
  DEFAULT_CKYC_SEARCH_FORM,
  DEFAULT_CUSTOMER_SEARCH_FORM,
  FILE_UPLOAD_CONSTANTS,
} from "./common.types";

export * from "./customer.types";
export * from "./kyc.types";
export * from "./address.types";
export * from "./basic.types";
export * from "./form60.types";
export * from "./nominee.types";
export * from "./photo.types";
export * from "./bank.types";
export * from "./additional.types";
export * from "./contact.types";
