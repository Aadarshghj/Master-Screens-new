export interface AddressDetailsPayload {
  addressTypeIdentity: string;
  houseNo: string;
  streetName: string;
  placeName: string;
  landmark?: string;
  pincode: string;
  country: string;
  state: string;
  district: string;
  postOfficeIdentity: string;
  city: string;
  latitude: number;
  longitude: number;
  addressProofTypeIdentity: string;
  digipin?: string;
  [key: string]: unknown;
}

export interface DynamicReferencePayload {
  referenceConfigIdentity: string;
  referenceFieldValue: string;
  [key: string]: unknown;
}

export interface SaveLeadDetailsPayload {
  tenantId: number;
  fullName: string;
  gender: string;
  contactNumber: string;
  email?: string;
  leadSourceIdentity: string;
  leadStageIdentity: string;
  leadStatusIdentity: string;
  assignTo: string;
  interestedProductIdentity: string;
  remarks: string;
  canvassedTypeIdentity: string;
  canvasserIdentity: string;
  nextFollowUpDate?: string;
  preferredTime?: string;
  leadProbability?: number;
  highPriority?: boolean;
  address: AddressDetailsPayload[];
  dynamicReferences: DynamicReferencePayload[];
  [key: string]: unknown;
}

export type ValueType = "TEXT" | "NUMBER" | "DATE" | "STRING";

export interface LeadDetailsFormData {
  leadCode: string;
  fullName: string;
  gender: string;
  contactNumber: string;
  email: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  assignTo: string;
  interestedProducts: string;
  remarks: string;
  addressType: string;
  houseNo: string;
  streetLane: string;
  placeName: string;
  pincode: string;
  country: string;
  state: string;
  district: string;
  postOfficeId: string;
  city: string;
  landmark: string;
  digipin: string;
  latitude: string;
  longitude: string;
  addressProofType: string;
  documentFile?: File;
  additionalReferences: Record<string, string>;
  canvassedTypeIdentity: string;
  canvasserIdentity: string;
  nextFollowUpDate: string;
  preferredTime: string;
  leadProbability: number | null;
  highPriority: boolean;
}

export interface LeadDetailsFormErrors {
  leadCode?: string;
  fullName?: string;
  gender?: string;
  contactNumber?: string;
  email?: string;
  leadSource?: string;
  leadStage?: string;
  leadStatus?: string;
  assignTo?: string;
  interestedProducts?: string;
  remarks?: string;
  addressType?: string;
  houseNo?: string;
  streetLane?: string;
  placeName?: string;
  pincode?: string;
  country?: string;
  state?: string;
  district?: string;
  postOfficeId?: string;
  city?: string;
  landmark?: string;
  digipin?: string;
  latitude?: string;
  longitude?: string;
  addressProofType?: string;
  documentFile?: string;
  additionalReferences?: Record<string, string>;
  general?: string;
}

export interface LeadDetailsResponse {
  leadId: string;
  leadCode: string;
  fullName: string;
  gender: string;
  contactNumber: string;
  email: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  assignTo: string;
  interestedProducts: string;
  remarks: string;
  addressDetails: AddressDetailsResponse;
  additionalReferences: Record<string, string | number | boolean | null>;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddressDetailsResponse {
  addressId: string;
  addressType: string;
  houseNo: string;
  streetLane: string;
  placeName: string;
  pincode: string;
  country: string;
  state: string;
  district: string;
  postOfficeId: string;
  city: string;
  landmark: string;
  digipin: string;
  latitude: string;
  longitude: string;
  addressProofType: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

export interface LeadDetailsConfig {
  genderOptions: ConfigOption[];
  leadSourceOptions: ConfigOption[];
  leadStageOptions: ConfigOption[];
  leadStatusOptions: ConfigOption[];
  interestedProductsOptions: ConfigOption[];
  addressTypeOptions: ConfigOption[];
  addressProofTypeOptions: ConfigOption[];
  countryOptions: ConfigOption[];
  stateOptions: ConfigOption[];
  districtOptions: ConfigOption[];
}

export interface LeadDetailsState {
  isReady: boolean;
}

export interface LeadDetailsFormProps {
  readonly?: boolean;
  isViewMode?: boolean;
  initialLeadData?: LeadSearchData;
}

export interface LeadSearchForm {
  fullName: string;
  contactNumber: string;
  email: string;
}

export interface LeadSearchData extends Record<string, unknown> {
  leadId: string;
  leadCode: string;
  fullName: string;
  gender: string;
  contactNumber: string;
  email?: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  assignTo: string;
  interestedProducts: string;
  remarks: string;
  canvassedTypeIdentity: string;
  canvasserIdentity: string;
  canvasserName?: string;
  canvasserCode?: string;
  nextFollowUpDate: string;
  preferredTime: string;
  leadProbability: number;
  highPriority: boolean;
  createdAt: string;
  updatedAt: string;
  addresses?: Array<{
    addressTypeIdentity: string;
    houseNo: string;
    streetName: string;
    placeName: string;
    pincode: string;
    country: string;
    state: string;
    district: string;
    postOfficeIdentity: string;
    city: string;
    landmark: string | null;
    latitude: number;
    longitude: number;
    addressProofType: string;
  }>;
  dynamicReferences?: Array<{
    referenceConfigIdentity: string;
    referenceFieldValue: string;
  }>;
  originalData?: {
    gender: string;
    leadSource: string;
    leadStage: string;
    leadStatus: string;
    interestedProducts: string;
  };
}

export interface LeadSearchApiResponse {
  leadIdentity: string;
  leadCode: string;
  fullName: string;
  gender: string;
  contactNumber: string;
  email: string;
  interestedProduct: string;
  leadSource: string;
  leadStage: string;
  leadStatus: string;
  remarks?: string;
  canvassedTypeIdentity: string;
  // canvasserIdentity: string;
  canvasserResponseDtos: Array<{
    canvasserName: string;
    canvasserCode: string;
    canvasserIdentity: string;
  }>;
  nextFollowUpDate: string;
  preferredTime: string;
  leadProbability: number;
  highPriority: boolean;
  addresses?: Array<{
    addressTypeIdentity: string;
    houseNo: string;
    streetName: string;
    placeName: string;
    pincode: string;
    country: string;
    state: string;
    district: string;
    postOfficeIdentity: string;
    city: string;
    landmark: string | null;
    latitude: number;
    longitude: number;
    addressProofType: string;
  }>;
  dynamicReferences?: Array<{
    referenceConfigIdentity: string;
    referenceFieldValue: string;
  }>;
}

export interface PaginatedLeadSearchResponse {
  content: LeadSearchApiResponse[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: unknown[];
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: unknown[];
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface UpdateLeadDetailsPayload {
  tenantId: number;
  fullName: string;
  gender: string;
  contactNumber: string;
  email?: string;
  leadSourceIdentity: string;
  leadStageIdentity: string;
  leadStatusIdentity: string;
  assignTo: string;
  interestedProductIdentity: string;
  remarks: string;
  address: AddressDetailsPayload[];
  dynamicReferences: DynamicReferencePayload[];
  [key: string]: unknown;
}

export interface LeadCreationSuccessResponse {
  leadIdentity: string;
  leadCode: string;
  status: string;
  leadDetails: {
    fullName: string;
    gender: string;
    contactNumber: string;
    email: string;
    leadSourceIdentity: string;
    leadStageIdentity: string;
    leadStatusIdentity: string;
    assignTo: string;
    remarks: string;
    interestedProductIdentity: string;
    address: AddressDetailsPayload[];
    dynamicReferences: DynamicReferencePayload[];
  };
  createdAt?: string;
}

export interface LeadCreationApiResponse {
  message: string;
  data: LeadCreationSuccessResponse;
}

export interface AdditionalReferenceConfig {
  identity: string;
  referenceFieldName: string;
  referenceFieldCode: string;
  dataType: string;
  maxLength: number;
  placeholderText: string;
  helpText: string;
  sortOrder: number;
  isMandatory: boolean;
  isActive: boolean;
}

export interface ImportHistoryData {
  batchIdentity: string;
  batchId: string;
  fileName: string;
  status: string;
  totalRecords: number;
  processedRecords: number;
  erroredRecords: number;
  uploadedBy: string;
  uploadedByName?: string;
  createdAt: string;
  completedAt: string;
  detailedMessage: string;
  uploadedDate?: string;
  uploadedTime?: string;
  completedDate?: string;
  completedTime?: string;
  [key: string]: unknown;
}

export interface ImportDetailsData {
  rowNumber: number;
  fullName: string;
  mobileNumber: string;
  leadSource: string;
  email: string;
  createdAt: string;
  errorMessage?: string;
  errorId?: number;
  siNo?: number;
  leadSourceName?: string;
  [key: string]: unknown;
}
