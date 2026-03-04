import type { Option } from "@/types/loan-management/application-form-type";

export const loanPurposeOptions: Option[] = [
  { label: "Home Loan", value: "HOME" },
  { label: "Education Loan", value: "EDUCATION" },
  { label: "Business Loan", value: "BUSINESS" },
];

export const nomineeRelationOptions: Option[] = [
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Spouse", value: "SPOUSE" },
  { label: "Sibling", value: "SIBLING" },
];
