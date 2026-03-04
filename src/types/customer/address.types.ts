// address.types.ts
import type { DMSFileData } from "@/hooks/useDMSFileUpload";
import type { ConfirmationModalData } from "@/layout/BasePageLayout";

export type AddressType = "PERMANENT" | "COMMUNICATION" | "OFFICE" | "BUSINESS";

export interface AddressOptions {
  addressType: Array<{ id: string; value: string; label: string }>;
  addressProofType: Array<{ id: string; value: string; label: string }>;
}

export interface AddressFormData {
  addressType: string;
  addressTypeId?: string;
  houseNo: string;
  streetLane: string;
  placeName: string;
  pinCode: string;
  country: string;
  state: string;
  district: string;
  postOfficeId: string;
  city: string;
  landmark?: string;
  digPin: string;
  latitude: string;
  longitude: string;
  addressProofType?: string;
  addressProofTypeId?: string;
  uploadedDocuments?: UploadedDocument[];
  coordinates: { latitude: number; longitude: number };
  isEnabled: boolean;
  isCommunicationSame: boolean;
  // File upload and UI state moved to useForm
  selectedFile: File | null;
  dmsFileData: DMSFileData | null;
  selectedPostOfficeId: string;
  isMapLoading: boolean;
  triggerPinCodeSearch: boolean;
}

export interface AddressCaptureResponse {
  addressIdentity?: string;
  identity?: string;
  id?: string;
  addressId?: string;
  customerId?: string;
  customerName?: string;
  addressType: string;
  addressTypeName?: string;
  addressTypeId?: string;
  doorNumber?: string;
  houseNo?: string;
  addressLine1?: string;
  streetLane?: string;
  addressLine2?: string;
  isEnabled?: boolean;
  isActive?: boolean;
  placeName?: string;
  pincode?: string;
  pinCode?: string;
  country?: string;
  state?: string;
  district?: string;
  postOffice?: string;
  postOfficeId?: string;
  postOfficeName?: string;
  city?: string;
  landmark?: string;
  digipin?: string;
  digPin?: string;
  latitude?: number;
  longitude?: number;
  geoAccuracy?: number;
  addressProofType?: string;
  // DMS file metadata (may be present on saved addresses)
  documentRefId?: string;
  filePath?: string;
  fileName?: string;
  fileType?: string;
  uploadedDocuments?: UploadedDocument[];
  createdBy?: number;
  updatedBy?: number;
  createdAt?: string;
  updatedAt?: string;
  coordinates?: { latitude: number; longitude: number };
}

export interface SaveAddressPayload extends Record<string, unknown> {
  addressType: string;
  doorNumber: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  placeName: string;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: number;
  postOfficeId: string;
  latitude: number;
  longitude: number;
  geoAccuracy: number;
  addressProofType: string;
  isActive: boolean;
  digipin: string;
  isSameAsPermanent: boolean;
  // DMS file fields
  documentRefId?: string;
  filePath?: string;
}

export interface SaveAddressRequest {
  customerId: string;
  payload: SaveAddressPayload;
}

export interface UpdateAddressRequest {
  customerId: string;
  addressId: string;
  payload: SaveAddressPayload;
}

export interface DeleteAddressRequest {
  customerId: string;
  addressId: string;
}

export interface UploadedDocument {
  file?: File;
  name: string;
  id: string;
  uploadDate: string;
  customerId?: string;
  users?: string;
  customer?: string;
  addressId?: string;
  addressIdentity?: string;
  identity?: string;
  documentType: string;
  idNumber: string;
  validFrom: string;
  validTo: string;
  verified: string;
  document: string;
  status: string;
}

export interface AddressLocationData {
  country: string;
  state: string;
  district: string;
  city: string;
  postOffices: Array<{ value: string; label: string }>;
  allPostOfficeData: Array<{ Name: string; State: string; District: string }>;
}

export interface GeolocationCoords {
  latitude: string;
  longitude: string;
}

export interface AddressFormProps {
  onFormSubmit?: (data: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  readOnly?: boolean;
  customerId?: string;
  customerIdentity?: string | null;
  isView?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface AddressTypeOption {
  identity: string;
  addressTypeName: string;
  entityTypeId: number;
}
export interface Address {
  identity: string;
  addressTypeName: string;
  isActive: boolean;
  allowedContexts: string | null;
  isMandatoryInThisContext: boolean;
}
export interface AddressTypeData {
  context: string;
  addressTypes: Address[];
  total: number;
}
export interface AddressProofTypeOption {
  id: string;
  value: string;
  label: string;
  name: string;
}

export interface PostOfficeData {
  Name?: string;
  name?: string;
  officeName?: string;
  State?: string;
  District?: string;
  identity?: string;
}

export interface PinCodeLocationData {
  stateDto?: { state: string };
  state?: string | { state: string };
  stateName?: string;
  districtDto?: { district: string };
  district?: string | { district: string };
  districtName?: string;
  citiesDto?: { city: string };
  city?: string | { city: string };
  cityName?: string;
  officeName?: string;
  latitude?: number | string;
  lat?: number | string;
  longitude?: number | string;
  lon?: number | string;
  lng?: number | string;
  postOffices?: PostOfficeData[];
  PostOffice?: PostOfficeData[];
}

export interface AddressApiResponse<T> {
  data?: T;
  message?: string;
  addresses?: T;
  result?: T;
  identity?: string;
}

export interface GetUploadedDocumentsParams {
  customerId: string;
}

export interface AddressDetailsProps {
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}
