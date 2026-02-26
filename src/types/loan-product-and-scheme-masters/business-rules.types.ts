export interface LoanBusinessRuleData {
  ruleId: string;
  loanProduct: string;
  loanProductName: string;
  ruleCode: string;
  ruleName: string;
  ruleCategory: string;
  ruleCategoryName: string;
  categoryIdentity: string;
  conditionExpression: string;
  actionExpression: string;
  isActive: boolean;
  status: string;
  statusName: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  identity?: string;
  productIdentity: string;
  active: boolean;
  [key: string]: unknown;
}

// Derive other types from the base
export type LoanBusinessRuleBase = Pick<
  LoanBusinessRuleData,
  "ruleCode" | "ruleName" | "conditionExpression" | "actionExpression"
>;

export type LoanBusinessRuleFormData = Pick<
  LoanBusinessRuleData,
  | "ruleCode"
  | "ruleName"
  | "conditionExpression"
  | "actionExpression"
  | "loanProduct"
  | "ruleCategory"
  | "isActive"
>;

export type SaveLoanBusinessRulePayload = Pick<
  LoanBusinessRuleData,
  "ruleCode" | "ruleName" | "conditionExpression" | "actionExpression"
> & {
  productIdentity: string;
  active: boolean;
  ruleCategoryIdentity: string;
  [key: string]: unknown;
};

export type UpdateLoanBusinessRulePayload = SaveLoanBusinessRulePayload;

export type LoanBusinessRuleSearchForm = Pick<
  LoanBusinessRuleData,
  "loanProduct" | "ruleCode" | "ruleName"
> & {
  category: string;
  status: string;
  ruleCodeOrName?: string;
  page: number;
  size: number;
};

export interface LoanBusinessRuleSearchResponse {
  content: LoanBusinessRuleData[];
  totalPages: number;
  totalElements: number;
  page: number;
  size: number;
}

export type LoanBusinessRuleApiResponse = Pick<
  LoanBusinessRuleData,
  | "ruleCode"
  | "ruleName"
  | "conditionExpression"
  | "actionExpression"
  | "identity"
  | "productIdentity"
  | "active"
  | "ruleCategoryName"
> & {
  ruleCategoryIdentity: string;
  identity: string;
  productIdentity: string;
  active: boolean;
};

export interface PaginatedLoanBusinessRuleResponse {
  content: LoanBusinessRuleApiResponse[];
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

export interface LoanBusinessRuleFormProps {
  readonly?: boolean;
}

export interface LoanBusinessRuleState {
  isReady: boolean;
  isEditMode: boolean;
  currentRuleId: string | null;
}
