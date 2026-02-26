import type { ConfirmationModalData } from "@/layout/BasePageLayout";
import type { PostOffice } from "./shared.types";
import type { DMSFileData } from "@/hooks/useDMSFileUpload";

export interface NomineeFormData {
  fullName: string;
  relationship: string;
  dob: string;
  contactNumber: string;
  percentageShare: number;
  isMinor: boolean;
  guardianName: string;
  guardianDob: string;
  guardianEmail: string;
  guardianContactNumber: string;
  isSameAddress: boolean;
  addressTypeId: string;
  doorNumber: string;
  addressLine1: string;
  landmark: string;
  placeName: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  postOfficeId: string;
  latitude: string;
  longitude: string;
  digipin: string;
  // File upload and UI state moved to useForm
  selectedFile?: File | null;
  dmsFileData?: DMSFileData | null;
  docRefId?: string | null;
  filePath?: string | null;
}

export interface NomineeSubmissionPayload {
  fullName: string;
  relationship: string;
  dob: string;
  contactNumber: string;
  percentageShare: number;
  isMinor: boolean;
  guardianName?: string;
  guardianDob?: string;
  guardianEmail?: string;
  guardianContactNumber?: string;
  isSameAddress: boolean;
  addressTypeId?: string;
  doorNumber?: string;
  addressLine1?: string;
  landmark?: string;
  placeName?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  postOfficeId?: string;
  latitude?: string;
  longitude?: string;
  digipin?: string;
  [key: string]: unknown;
}

// API Response Types
export interface NomineeData {
  nomineeIdentity: string;
  fullName: string;
  relationship: string;
  dob: string;
  contactNumber: string;
  percentageShare: number;
  isMinor: boolean;
  guardianName?: string;
  guardianDob?: string;
  guardianEmail?: string;
  guardianContactNumber?: string;
  isSameAddress: boolean;
  addressTypeId?: string;
  doorNumber?: string;
  addressLine1?: string;
  landmark?: string;
  placeName?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  postOfficeId?: string;
  latitude?: string;
  longitude?: string;
  digipin?: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  filePath: string;
  docRefId: string;
}

export interface NomineeResponse {
  message: string;
  data?: NomineeData;
}

export interface NomineeTableProps {
  readOnly?: boolean;
  onEditNominee?: (nominee: NomineeData) => void;
  customerIdentity?: string | null;
  isView?: boolean;
  pendingForApproval?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface NomineeFormProps {
  editingNominee?: NomineeData | null;
  onCancelEdit?: () => void;
  customerIdentity?: string | null;
  existingNominees?: NomineeData[];
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface NomineePageProps {
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
  pendingForApproval?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

// Request Types
export type CreateNomineeRequest = NomineeSubmissionPayload;

export type UpdateNomineeRequest = NomineeSubmissionPayload;

export interface DeleteNomineeRequest {
  customerId: string;
  nomineeId: string;
  updatedBy: number;
}

// Validation Types
export interface ShareValidationResponse {
  isValid: boolean;
  message?: string;
  totalShare?: number;
}

// Address and Location Types
export interface NomineePincodeDetails {
  pincode: string;
  state: string;
  district: string;
  city: string;
}

export interface CustomerAddress {
  addressTypeId: string;
  doorNumber: string;
  addressLine1: string;
  landmark?: string;
  placeName: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  postOfficeId: string;
  latitude?: string;
  longitude?: string;
  digipin?: string;
}

export interface NomineeLocationData {
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: string;
  longitude: string;
  // Additional properties that might come from API
  stateName?: string;
  districtName?: string;
  cityName?: string;
  postOfficeNames?: string[];
}

export interface NomineePostOffice {
  id: number;
  name: string;
  pincode: string;
}

// API Response Types
export interface NomineeApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PostOfficeApiResponse {
  pincode: string;
  offices: PostOffice[];
}

export interface LocationApiResponse {
  stateDto: {
    name: string;
  };
  districtDto: {
    name: string;
  };
  citiesDto: {
    name: string;
  };
  latitude: string;
  longitude: string;
}

// API Response Types for Service Layer
export interface NomineeApiResponseData {
  nomineeIdentity?: string;
  id?: string;
  fullName?: string;
  relationship?: string;
  dob?: string;
  contactNumber?: string;
  percentageShare?: number;
  isMinor?: boolean;
  guardianName?: string;
  guardianDob?: string;
  guardianEmail?: string;
  guardianContactNumber?: string;
  isSameAddress?: boolean;
  addressTypeId?: string;
  doorNumber?: string;
  addressLine1?: string;
  landmark?: string;
  placeName?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  postOfficeId?: string;
  latitude?: string;
  longitude?: string;
  digipin?: string;
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  filePath?: string;
  docRefId?: string;
}

export interface NomineeListApiResponse {
  nominees?: NomineeApiResponseData[];
  data?: NomineeApiResponseData[];
}
