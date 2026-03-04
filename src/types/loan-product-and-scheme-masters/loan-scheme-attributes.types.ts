export interface LoanSchemeAttributeBase {
  attributeKey: string;
  attributeName: string;
  dataType: string;
  defaultValue?: string;
  listValues?: string;
  description?: string;
  required: boolean;
  active: boolean;
  takeoverBtiScheme: boolean;
}
export interface LoanSchemeAttributeApiResponse
  extends LoanSchemeAttributeBase {
  identity: string;
  productIdentity: string;
}

export type LoanSchemeAttributeFormData = Omit<
  LoanSchemeAttributeBase,
  "required" | "active"
> & {
  loanProduct: string;
  isRequired: boolean;
  isActive: boolean;
};

export type SaveLoanSchemeAttributePayload = LoanSchemeAttributeBase & {
  productIdentity: string;
  [key: string]: unknown;
};

export type UpdateLoanSchemeAttributePayload = SaveLoanSchemeAttributePayload;

export interface LoanSchemeAttributeData {
  attributeId: string;
  loanProduct: string;
  loanProductName: string;
  attributeKey: string;
  attributeName: string;
  dataType: string;
  dataTypeName: string;
  defaultValue?: string;
  listValues?: string;
  description?: string;
  isRequired: boolean;
  isActive: boolean;
  takeoverBtiScheme: boolean;
  status: string;
  statusName: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  identity?: string;
  productIdentity?: string;
  required?: boolean;
  active?: boolean;
  [key: string]: unknown;
}

export interface LoanSchemeAttributeSearchForm {
  loanProduct?: string;
  attributeName?: string;
  status?: string;
  dataType?: string;
  page: number;
  size: number;
  required?: string;
}
export interface LoanSchemeAttributeSearchResponse {
  content: LoanSchemeAttributeData[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export interface PaginatedLoanSchemeAttributeResponse {
  content: LoanSchemeAttributeApiResponse[];
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

export interface ConfigOption {
  value: string;
  label: string;
  identity?: string;
}

export interface LoanSchemeAttributeFormProps {
  readonly?: boolean;
}

export interface LoanSchemeAttributeState {
  isReady: boolean;
  isEditMode: boolean;
  currentAttributeId: string | null;
}
