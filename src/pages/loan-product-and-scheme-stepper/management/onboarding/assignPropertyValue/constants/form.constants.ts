// constants/assignProperty.constants.ts
import type { AssignPropertyFormData } from "@/types/loan-product-and schema Stepper/assign-property.types";

export const assignPropertyDefaultFormValues: AssignPropertyFormData = {
  loanSchemeName: "",
};

export const ASSIGN_PROPERTY_VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    loanSchemeName: "Loan scheme is required",
  },
};

export const ASSIGN_PROPERTY_FIELD_LABELS = {
  loanProduct: "Loan Product",
  loanScheme: "Scheme Name",
  propertyKey: "Property Key",
  defaultValue: "Default Value",
  propertyValue: "Property Value",
  glAccountId: "GL Account ID",
  status: "Status",
};

export const ASSIGN_PROPERTY_PLACEHOLDERS = {
  loanProduct: "Auto fetch from first stepper",
  loanScheme: "Auto fetch from first stepper",
  glAccountId: "Search and Select Account",
};

export const ASSIGN_PROPERTY_BUTTON_LABELS = {
  reset: "Reset",
  save: "Save Property Value",
};
