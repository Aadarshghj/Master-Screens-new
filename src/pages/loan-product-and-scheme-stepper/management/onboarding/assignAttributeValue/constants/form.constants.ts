import type { AssignAttributeFormData } from "@/types/loan-product-and schema Stepper/index";

export const assignAttributeDefaultFormValues: AssignAttributeFormData = {
  loanProductName: "",
  loanSchemeName: "",
};

export const ASSIGN_ATTRIBUTE_VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    // amazonq-ignore-next-line
    loanProductName: "Loan product is required",
    loanSchemeName: "Loan scheme is required",
  },
};

export const ASSIGN_ATTRIBUTE_FIELD_LABELS = {
  loanProductName: "Loan Product",
  loanSchemeName: "Loan Scheme",
};

export const ASSIGN_ATTRIBUTE_PLACEHOLDERS = {
  loanProductName: "Auto fetch from first stepper",
  loanSchemeName: "Auto fetch from first stepper",
};
