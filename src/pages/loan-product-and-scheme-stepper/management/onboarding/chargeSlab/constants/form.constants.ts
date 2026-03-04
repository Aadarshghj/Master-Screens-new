export const loanSchemeChargeSlabDefaultFormValues = {
  loanScheme: "",
  charges: "",
  rateType: "",
  slabRate: "",
  fromAmount: "",
  toAmount: "",
  chargeOn: "",
};

export const CHARGES_OPTIONS = [
  { value: "1-Processing fee", label: "1-Processing fee" },
  { value: "2-Legal fee", label: "2-Legal fee" },
  { value: "3-Documentation fee", label: "3-Documentation fee" },
  { value: "0.5-Stamp Duty", label: "0.5-Stamp Duty" },
  { value: "1-Valuation fee", label: "1-Valuation fee" },
  { value: "0.5-Service charge", label: "0.5-Service charge" },
];

export const RATE_TYPE_OPTIONS = [
  { value: "FIXED", label: "FIXED" },
  { value: "PERCENTAGE", label: "PERCENTAGE" },
];

export const CHARGE_ON_OPTIONS = [
  { value: "PRINCIPAL", label: "PRINCIPAL" },
  { value: "INTEREST", label: "INTEREST" },
  { value: "LOAN_AMOUNT", label: "LOAN_AMOUNT" },
  { value: "EMI", label: "EMI" },
];

export const LOAN_SCHEME_CHARGE_SLAB_VALIDATION_RULES = {
  REQUIRED_FIELDS: {
    charges: "Charges is required",
    rateType: "Rate Type is required",
    slabRate: "Slab Rate is required",
    fromAmount: "From Amount is required",
    toAmount: "To Amount is required",
    chargeOn: "Charge On is required",
  },
};

export const LOAN_SCHEME_CHARGE_SLAB_FIELD_LABELS = {
  loanScheme: "Loan Scheme",
  charges: "Charges",
  rateType: "Rate Type",
  slabRate: "Slab Rate",
  fromAmount: "From Amount",
  toAmount: "To Amount",
  chargeOn: "Charge On",
};

// Import types from centralized type files
export type {
  LoanSchemeChargeSlabFormData,
  ChargeSlab,
  LoanSchemeChargeSlabProps,
} from "@/types/loan-product-and schema Stepper/charge-slab.types";
