// Business Rules Types - Base type with all attributes
export interface LoanBusinessRuleData {
  id: string;
  loanName: string;
  businessRuleIdentity: string;
  businessRuleName?: string;
  executionOrder: number;
  effectiveFrom: string;
  effectiveTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Derived types using Pick utility
export type BusinessRuleFormData = Pick<
  LoanBusinessRuleData,
  | "loanName"
  | "businessRuleIdentity"
  | "executionOrder"
  | "effectiveFrom"
  | "effectiveTo"
  | "isActive"
>;

export type BusinessRuleTableData = Pick<
  LoanBusinessRuleData,
  | "id"
  | "businessRuleIdentity"
  | "businessRuleName"
  | "executionOrder"
  | "effectiveFrom"
  | "effectiveTo"
  | "isActive"
>;

export type BusinessRulePayload = Pick<
  LoanBusinessRuleData,
  | "businessRuleIdentity"
  | "executionOrder"
  | "effectiveFrom"
  | "effectiveTo"
  | "isActive"
>;

export type BusinessRuleApiResponse = Pick<
  LoanBusinessRuleData,
  | "id"
  | "businessRuleIdentity"
  | "executionOrder"
  | "effectiveFrom"
  | "effectiveTo"
  | "isActive"
  | "createdAt"
  | "updatedAt"
>;

export type BusinessRuleEditingItem = Pick<
  LoanBusinessRuleData,
  | "id"
  | "businessRuleIdentity"
  | "executionOrder"
  | "effectiveFrom"
  | "effectiveTo"
  | "isActive"
>;

// Non-derived types (external interfaces)
export interface MasterBusinessRule {
  value: string;
  label: string;
}

export interface BusinessRuleProps {
  onComplete?: () => void;
  onSave?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}

export interface BusinessRulesTableProps {
  tableData: BusinessRuleTableData[];
  onEdit?: (item: BusinessRuleTableData) => void;
  onDelete?: (item: BusinessRuleTableData) => void;
}
