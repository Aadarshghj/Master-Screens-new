export interface LoanSchemePropertyBase {
  propertyKey: string;
  propertyName: string;
  dataType: string;
  defaultValue?: string;
  isRequired: boolean;
  isActive: boolean;
}
export interface LoanSchemePropertyFormData extends LoanSchemePropertyBase {
  loanProduct: string;
  description: string;
}
export interface LoanSchemePropertyFormData extends LoanSchemePropertyBase {
  loanProduct: string;
  description: string;
}

export interface SaveLoanSchemePropertyPayload {
  productId: string;
  propertyKey: string;
  propertyName: string;
  dataTypeId: string;
  defaultValue?: string;
  isRequired: boolean;
  isActive: boolean;
  [key: string]: unknown;
}

export interface UpdateLoanSchemePropertyPayload {
  productId: string;
  propertyKey: string;
  propertyName: string;
  dataTypeId: string;
  defaultValue?: string;
  isRequired: boolean;
  isActive: boolean;
  description: string;
  [key: string]: unknown;
}

export interface LoanSchemePropertyData {
  propertyId: string;
  loanProduct: string;
  loanProductName: string;
  propertyKey: string;
  property: string;
  propertyName: string;
  dataType: string;
  dataTypeName: string;
  defaultValue?: string;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
  status: string;
  statusName: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}
export interface LoanSchemePropertySearchForm {
  loanProduct?: string;
  status?: string;
  dataType?: string;
  isRequired?: string;
  page?: number;
  size?: number;
}

export interface LoanSchemePropertyApiResponse extends LoanSchemePropertyBase {
  propertyIdentity: string;
  productId: string;
  description: string;
}

export interface PaginatedLoanSchemePropertyResponse {
  content: LoanSchemePropertyApiResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

export interface LoanSchemePropertyFormProps {
  readonly?: boolean;
}

export interface LoanSchemePropertyState {
  isReady: boolean;
  isEditMode: boolean;
  currentPropertyId: string | null;
  currentPropertyData: LoanSchemePropertyData | null;
}

export interface LoanSchemePropertyCreationResponse {
  propertyIdentity: string;
  propertyKey: string;
  propertyName: string;
  status: string;
  message: string;
}

export interface LoanSchemePropertyCreationApiResponse {
  message: string;
  data: LoanSchemePropertyCreationResponse;
}
