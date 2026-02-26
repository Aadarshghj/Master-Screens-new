import type { LTVSlabFormData } from "@/types/loan-product-and schema Stepper/ltv-slabs.types";

export const ltvSlabDefaultFormValues: LTVSlabFormData = {
  loanScheme: "",
  fromAmount: "",
  toAmount: "",
  ltvPercentage: "",
  ltvOn: "",
};

export const ltvOnOptions = [
  { label: "Total Outstanding", value: "Total Outstanding" },
  { label: "Principal Amount", value: "Principal Amount" },
  { label: "Market Value", value: "Market Value" },
];
