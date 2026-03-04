export const businessRulesDefaultFormValues = {
  loanName: "",
  businessRuleIdentity: "",
  executionOrder: 0,
  effectiveFrom: "",
  effectiveTo: "",
  isActive: true,
};

export const BUSINESS_RULE_OPTIONS = [
  { value: "R001-CIBIL Score Check", label: "R001-CIBIL Score Check" },
  { value: "R002-Income Verification", label: "R002-Income Verification" },
  { value: "R003-Age Limit Check", label: "R003-Age Limit Check" },
  { value: "R004-Employment Status", label: "R004-Employment Status" },
  { value: "R005-Debt to Income Ratio", label: "R005-Debt to Income Ratio" },
  { value: "R006-Property Valuation", label: "R006-Property Valuation" },
  { value: "R007-Credit History", label: "R007-Credit History" },
];

export const BUSINESS_RULES_VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    businessRule: "Business Rule is required",
    executionOrder: "Execution Order is required",
    effectiveFrom: "Effective From date is required",
  },
};

export const BUSINESS_RULES_FIELD_LABELS = {
  loanScheme: "Loan Scheme",
  businessRule: "Business Rule",
  executionOrder: "Execution Order",
  effectiveFrom: "Effective From",
  effectiveTo: "Effective To",
  active: "Active",
  status: "Status",
};

// ============================================
// types/business-rules.types.ts
// ============================================

export interface BusinessRulesFormData {
  loanScheme: string;
  businessRule: string;
  executionOrder: number;
  effectiveFrom: string;
  effectiveTo: string;
  active: boolean;
}

export interface BusinessRule {
  id: string;
  businessRule: string;
  executionOrder: number;
  effectiveFrom: string;
  effectiveTo: string;
  status: string;
}

export interface BusinessRulesProps {
  onComplete?: () => void;
  onSave?: () => void;
}
