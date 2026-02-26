import type { ConfirmationModalData } from "@/layout/BasePageLayout";

export interface BasicInfoFormData {
  customerCode: string;
  age?: number;
  mobileOtp: string;
  crmReferenceId: string;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  aadharName: string;
  gender: string;
  dob: string;
  guardian: string;
  maritalStatus: string;
  spouseName: string;
  fatherName: string;
  motherName: string;
  taxCategory: string;
  customerStatus: string;
  customerListType: string;
  customerId: string;
  loyaltyPoints: string;
  valueScore: string;
  mobileNumber: string;
  isBusiness: boolean;
  isFirm: boolean;
  isMinor: boolean;
  documentVerified: boolean;
  activeStatus: boolean;
  otpVerified?: boolean; // Add otpVerified property
  branchId?: string; // Add branchId property
}
export interface SubmissionPayload {
  tenantId: string;
  branchId: string; // UUID string
  salutation: string; // Identity value from API
  firstName: string;
  middleName: string;
  lastName: string;
  aadharName: string;
  gender: string; // Identity value from API
  dob: string;
  maritalStatus: string; // Identity value from API
  taxCategory: string; // Identity value from API
  customerStatus: string; // Identity value from API
  aadharVault: string; // String format
  crmReferenceId: string;
  occupation: string; // UUID string
  employer: string;
  annualIncome: number;
  customerListTypeId: string; // UUID string
  isBusiness: boolean;
  isFirm: boolean;
  createdBy: number;
  updatedBy: number;
  spouseName: string;
  fatherName: string;
  motherName: string;
  isMinor: boolean;
  guardianCustomerId: string;
  nationality: string;
  residentialStatusId: string;
  preferredLanguageId: string;
  locality: number;
  mobileNumber: string;
  otpVerified: boolean;
  isVerified: boolean;
  visualScore: number;
}

export interface BasicInfoData {
  identity: string;
  customerCode: string;
  status: string;
  basic: BasicInfoFormData;
}

export interface BasicInfoFormProps {
  onFormSubmit?: (data: BasicInfoFormData) => Promise<void>;
  initialData?: Partial<BasicInfoFormData>;
  readOnly?: boolean;
  customerIdentity?: string | null;
  isView?: boolean;
  customerFirstName?: string | null;
  customerMiddleName?: string | null;
  customerLastName?: string | null;
  mobileNumber?: string | null;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface SalutationType {
  salutation: string;
  identity: string;
  isActive: boolean;
}

export interface GenderType {
  id: number;
  name: string;
  identity: string;
  isActive: boolean;
  gender: string;
}

export interface MaritalStatusType {
  id: number;
  name: string;
  identity: string;
  isActive: boolean;
  statusName: string;
}

export interface TaxCategoryType {
  id: number;
  name: string;
  identity: string;
  isActive: boolean;
  taxCatName: string;
}

export interface CustomerStatusType {
  id: number;
  name: string;
  identity: string;
  isActive: boolean;
  statusName: string;
}

export interface GuardianSearchResult {
  identity: string;
  firstname: string;
  lastname: string;
}

// Basic Information Page Response Types
export interface BasicInfoResponse {
  identity: string;
  customerCode: string;
  status: string;
}

export interface BasicInfoExtendedData {
  otpVerified?: boolean;
  guardianCustomerId?: string;
  customerListTypeId?: string;
  aadharVaultId?: string;
}

// Service Submission Payload (moved from service types)
export interface ServiceSubmissionPayload {
  tenantId: string;
  branchId: string;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  aadharName: string;
  gender: string;
  dob: string;
  maritalStatus: string;
  taxCategory: string;
  customerStatus: string;
  aadharVault: string | null;
  crmReferenceId: string;
  // occupation: string;
  // employer: string;
  // annualIncome: number;
  // customerListTypeId: string;
  isBusiness: boolean;
  otpVerified: boolean;
  guardianCustomerId: string;
  isVerified: boolean;
  isMinor: boolean;
  mobileNumber: string;
  isFirm: boolean;
  spouseName: string;
  fatherName: string;
  motherName: string;
  // createdBy: number;
  // updatedBy: number;
  // visualScore: number;
  // nationality: string;
  // residentialStatusId: string;
  // preferredLanguageId: string;
  // locality: number;
  // Index signature to make it compatible with Record<string, unknown>
  [key: string]: unknown;
}

// API Response Types
export interface BasicInfoApiResponse {
  identity?: string;
  id?: string;
  customerCode?: string;
  customer_code?: string;
  status?: string;
  basic?: BasicInfoApiBasicData;
  data?: BasicInfoApiBasicData;
}

export interface BasicInfoApiBasicData {
  customerCode?: string;
  crmReferenceId?: string;
  crm_reference_id?: string;
  salutation?: string;
  firstName?: string;
  first_name?: string;
  middleName?: string;
  middle_name?: string;
  lastName?: string;
  last_name?: string;
  aadharName?: string;
  aadhar_name?: string;
  gender?: string;
  dob?: string;
  date_of_birth?: string;
  guardian?: string;
  guardian_customer_id?: string;
  maritalStatus?: string;
  marital_status?: string;
  spouseName?: string;
  spouse_name?: string;
  fatherName?: string;
  father_name?: string;
  motherName?: string;
  mother_name?: string;
  taxCategory?: string;
  tax_category?: string;
  customerStatus?: string;
  customer_status?: string;
  customerListType?: string;
  customer_list_type?: string;
  loyaltyPoints?: string;
  loyalty_points?: string;
  valueScore?: string;
  value_score?: string;
  mobileNumber?: string;
  mobile_number?: string;
  otpVerified?: boolean;
  otp_verified?: boolean;
  isBusiness?: boolean;
  is_business?: boolean;
  isFirm?: boolean;
  is_firm?: boolean;
  documentVerified?: boolean;
  document_verified?: boolean;
  activeStatus?: boolean;
  active_status?: boolean;
  age?: number;
  isMinor?: boolean;
  is_minor?: boolean;
  branchId?: string;
  branch_id?: string;
}

// Redux State Types
export interface ApiQueriesState {
  [key: string]: {
    endpointName?: string;
    data?: unknown;
    [key: string]: unknown;
  };
}

export interface BasicRootState {
  api: {
    queries: ApiQueriesState;
  };
}
