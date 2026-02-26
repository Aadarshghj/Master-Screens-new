import type { LoanBusinessRuleFormData } from "@/types/loan-product-and-scheme-masters/business-rules.types";

export const loanBusinessRuleDefaultFormValues: LoanBusinessRuleFormData = {
  loanProduct: "",
  ruleCode: "",
  ruleName: "",
  ruleCategory: "",
  conditionExpression: "",
  actionExpression: "",
  isActive: true,
};
