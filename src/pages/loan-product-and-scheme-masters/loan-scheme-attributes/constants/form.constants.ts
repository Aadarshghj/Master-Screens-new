import type { LoanSchemeAttributeFormData } from "@/types/loan-product-and-scheme-masters/loan-scheme-attributes.types";

export const loanSchemeAttributeDefaultFormValues: LoanSchemeAttributeFormData =
  {
    loanProduct: "",
    attributeKey: "",
    attributeName: "",
    dataType: "",
    listValues: "",
    defaultValue: "",
    description: "",
    isRequired: false,
    isActive: true,
    takeoverBtiScheme: false,
  };
