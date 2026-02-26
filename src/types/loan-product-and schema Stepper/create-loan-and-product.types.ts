// Loan Product Stepper Types
export interface LoanProductStepperState {
  currentStep: string;
  completedSteps: Set<string>;
  stepData: Record<string, unknown>;
  isSubmitting: boolean;
}

// Loan Scheme Types - Base type with all attributes
export interface LoanSchemeData {
  id?: string;
  identity?: string;
  loanProductName: string;
  schemeCode: string;
  schemeName: string;
  schemeTypeName: string;
  schemeTypeIdentity?: string;
  productIdentity?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  fromAmount: string | number;
  toAmount: string | number;
  minimumPeriod: string | number;
  minPeriod?: number;
  minPeriodTypeName: string;
  minPeriodTypeIdentity?: string;
  periodTypeName: string;
  maximumPeriod: string | number;
  maxPeriod?: number;
  maxPeriodTypeName: string;
  maxPeriodTypeIdentity?: string;
  interestTypeName: string;
  interestTypeIdentity?: string;
  fixedInterestRate: string | number;
  penalInterest?: string;
  penalInterestRate?: number;
  penalInterestBaseName?: string;
  penalInterestOnIdentity?: string;
  rebateBaseName?: string;
  rebateOnIdentity?: string;
  rebatePercentage?: string | number;
  gracePeriod?: string | number;
  moratoriumInterestRate?: string | number;
  moratoriumInterestVariationReq?: boolean;
  remarks?: string;
  penalInterestApplicable: boolean;
  reverseInterestApplicable: boolean;
  moratoriumInterestRequired: boolean;
  rebateApplicable: boolean;
  emiApplicable: boolean;
  takeoverScheme: boolean;
  coLendingScheme: boolean;
  rebate?: boolean;
  emiScheme?: boolean;
  takeOverScheme?: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  tenantId?: string;
}

// Derived types using Pick and utility types
export type LoanSchemeFormData = Pick<
  LoanSchemeData,
  | "loanProductName"
  | "schemeCode"
  | "schemeTypeName"
  | "schemeName"
  | "effectiveFrom"
  | "effectiveTo"
  | "fromAmount"
  | "toAmount"
  | "minimumPeriod"
  | "minPeriodTypeName"
  | "periodTypeName"
  | "maximumPeriod"
  | "maxPeriodTypeName"
  | "interestTypeName"
  | "fixedInterestRate"
  | "penalInterest"
  | "penalInterestBaseName"
  | "rebateBaseName"
  | "rebatePercentage"
  | "gracePeriod"
  | "moratoriumInterestRate"
  | "remarks"
  | "penalInterestApplicable"
  | "reverseInterestApplicable"
  | "moratoriumInterestRequired"
  | "rebateApplicable"
  | "emiApplicable"
  | "takeoverScheme"
  | "coLendingScheme"
  | "active"
>;

export type LoanSchemeSearchResult = Pick<
  LoanSchemeData,
  | "identity"
  | "productIdentity"
  | "schemeCode"
  | "schemeName"
  | "schemeTypeIdentity"
  | "effectiveFrom"
  | "effectiveTo"
  | "fromAmount"
  | "toAmount"
  | "minPeriod"
  | "minPeriodTypeIdentity"
  | "maxPeriod"
  | "maxPeriodTypeIdentity"
  | "interestTypeIdentity"
  | "fixedInterestRate"
  | "penalInterestApplicable"
  | "penalInterestRate"
  | "penalInterestOnIdentity"
  | "moratoriumInterestVariationReq"
  | "moratoriumInterestRate"
  | "rebateOnIdentity"
  | "rebate"
  | "rebatePercentage"
  | "reverseInterestApplicable"
  | "remarks"
  | "active"
  | "tenantId"
>;

export type LoanSchemeSearchForm = Pick<
  LoanSchemeData,
  "loanProductName" | "schemeName" | "schemeCode" | "schemeTypeName"
> & {
  loanProduct: string; // Alias for loanProductName in search
};

export type SchemeData = Partial<LoanSchemeData> & {
  data?: Partial<LoanSchemeData>;
};

// Non-derived types (external interfaces)
export interface DropdownOption {
  value: string;
  label: string;
}

export interface LoanSchemeApiResponse {
  message: string;
  data: LoanSchemeData;
}

export type LoanSchemeApiResponseType = ApiResponse<LoanSchemeData>;

export interface StepComponentProps {
  onComplete: () => void;
}

export interface SearchResponse {
  content: LoanSchemeSearchResult[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  message: string;
  data: T;
}

export interface LoanProductItem {
  isActive: boolean;
  identity: string;
  productCode: string;
  loanProductName: string;
}

export interface SchemeTypeItem {
  id?: string;
  identity?: string;
  name?: string;
  schemeTypeName?: string;
}

export interface MaxPeriodTypeItem {
  id?: string;
  identity?: string;
  name?: string;
  periodTypeName?: string;
}

export interface MinPeriodTypeItem {
  id?: string;
  identity?: string;
  name?: string;
  periodTypeName?: string;
}

export interface InterestTypeFlagItem {
  id?: string;
  identity?: string;
  name?: string;
  interestTypeName?: string;
}

export interface RebateOnOptionItem {
  id?: string;
  identity?: string;
  name?: string;
  rebateBaseName?: string;
}

export interface PenalOnOptionItem {
  id?: string;
  identity?: string;
  name?: string;
  penalInterestBaseName?: string;
}

export interface SchemeApiResponse {
  identity?: string;
  data?: {
    identity?: string;
    id?: string;
    schemeId?: string;
  };
  id?: string;
}

export interface CustomEventDetail {
  schemeId: string;
  [key: string]: unknown;
}

export interface CreateLoanSchemeProps {
  onComplete?: (schemeId?: string) => void;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

// Loan Product Stepper Types
export interface LoanProductStepperState {
  currentStep: string;
  completedSteps: Set<string>;
  stepData: Record<string, unknown>;
  isSubmitting: boolean;
}
