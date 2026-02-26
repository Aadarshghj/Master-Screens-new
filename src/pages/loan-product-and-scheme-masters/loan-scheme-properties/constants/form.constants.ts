import type { LoanSchemePropertyFormData } from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";

export const loanSchemePropertyDefaultFormValues: LoanSchemePropertyFormData = {
  loanProduct: "",
  propertyKey: "",
  propertyName: "",
  dataType: "",
  defaultValue: "",
  description: "",
  isRequired: false,
  isActive: true,
};
